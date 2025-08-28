import { prisma } from '@config/database';
import { Either, right } from '@core/either';
import {
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import { Service } from 'fastify-decorators';

interface DashboardStats {
  totalMembers: number;
  todayRegistrations: number;
  weekRegistrations: number;
  monthlyGrowth: number;
  dailyGrowth: number;
  weeklyGrowth: number;
}

interface RegistrationsByDay {
  date: string;
  count: number;
}

interface MonthlyTrend {
  month: string;
  members: number;
}

interface DashboardResponse {
  stats: DashboardStats;
  registrationsByDay: RegistrationsByDay[];
  monthlyTrend: MonthlyTrend[];
}

type Response = Either<null, DashboardResponse>;

@Service()
export default class DashboardStatsUseCase {
  async execute(timezone: string = 'America/Rio_Branco'): Promise<Response> {
    const now = new Date();

    // Converter para o timezone do usuário
    const nowInTimezone = toZonedTime(now, timezone);

    // Calcular datas no timezone do usuário e depois converter para UTC
    const todayStart = fromZonedTime(startOfDay(nowInTimezone), timezone);
    const yesterdayStart = fromZonedTime(
      startOfDay(subDays(nowInTimezone, 1)),
      timezone,
    );

    const weekStart = fromZonedTime(
      startOfWeek(nowInTimezone, { weekStartsOn: 0 }),
      timezone,
    );
    const lastWeekStart = fromZonedTime(
      startOfWeek(subWeeks(nowInTimezone, 1), { weekStartsOn: 0 }),
      timezone,
    );

    const monthStart = fromZonedTime(startOfMonth(nowInTimezone), timezone);
    const lastMonthStart = fromZonedTime(
      startOfMonth(subMonths(nowInTimezone, 1)),
      timezone,
    );
    const lastMonthEnd = fromZonedTime(
      endOfMonth(subMonths(nowInTimezone, 1)),
      timezone,
    );

    // Total de membros
    const totalMembers = await prisma.member.count();

    // Cadastros de hoje
    const todayRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    });

    // Cadastros de ontem
    const yesterdayRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: yesterdayStart,
          lt: todayStart,
        },
      },
    });

    // Cadastros desta semana
    const weekRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: weekStart,
        },
      },
    });

    // Cadastros da semana passada
    const lastWeekRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: lastWeekStart,
          lt: weekStart,
        },
      },
    });

    // Cadastros deste mês
    const monthRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    });

    // Cadastros do mês passado
    const lastMonthRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    // Calcular crescimentos
    const dailyGrowth =
      yesterdayRegistrations > 0
        ? ((todayRegistrations - yesterdayRegistrations) /
            yesterdayRegistrations) *
          100
        : todayRegistrations > 0
          ? 100
          : 0;

    const weeklyGrowth =
      lastWeekRegistrations > 0
        ? ((weekRegistrations - lastWeekRegistrations) /
            lastWeekRegistrations) *
          100
        : weekRegistrations > 0
          ? 100
          : 0;

    const monthlyGrowth =
      lastMonthRegistrations > 0
        ? ((monthRegistrations - lastMonthRegistrations) /
            lastMonthRegistrations) *
          100
        : monthRegistrations > 0
          ? 100
          : 0;

    // Cadastros por dia da semana (últimos 7 dias)
    const registrationsByDay: RegistrationsByDay[] = [];

    for (let i = 6; i >= 0; i--) {
      const dayInTimezone = subDays(nowInTimezone, i);
      const dayStart = fromZonedTime(startOfDay(dayInTimezone), timezone);
      const dayEnd = fromZonedTime(
        startOfDay(subDays(dayInTimezone, -1)),
        timezone,
      );

      const count = await prisma.member.count({
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      registrationsByDay.push({
        date: format(dayInTimezone, 'EEE', { locale: ptBR }),
        count,
      });
    }

    // Tendência mensal (últimos 5 meses)
    const monthlyTrend: MonthlyTrend[] = [];

    for (let i = 4; i >= 0; i--) {
      const monthInTimezone = subMonths(nowInTimezone, i);
      const monthStartUTC = fromZonedTime(
        startOfMonth(monthInTimezone),
        timezone,
      );
      const nextMonthUTC = fromZonedTime(
        startOfMonth(subMonths(monthInTimezone, -1)),
        timezone,
      );

      const members = await prisma.member.count({
        where: {
          createdAt: {
            gte: monthStartUTC,
            lt: nextMonthUTC,
          },
        },
      });

      monthlyTrend.push({
        month: format(monthInTimezone, 'MMM', { locale: ptBR }),
        members,
      });
    }

    const stats: DashboardStats = {
      totalMembers,
      todayRegistrations,
      weekRegistrations,
      monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
      dailyGrowth: Number(dailyGrowth.toFixed(1)),
      weeklyGrowth: Number(weeklyGrowth.toFixed(1)),
    };

    return right({
      stats,
      registrationsByDay,
      monthlyTrend,
    });
  }
}
