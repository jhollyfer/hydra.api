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

    const nowInTimezone = toZonedTime(now, timezone);

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

    const totalMembers = await prisma.member.count();

    const todayRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    });

    const yesterdayRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: yesterdayStart,
          lt: todayStart,
        },
      },
    });

    const weekRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: weekStart,
        },
      },
    });

    const lastWeekRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: lastWeekStart,
          lt: weekStart,
        },
      },
    });

    const monthRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    });

    const lastMonthRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    let dailyGrowth = 0;

    if (yesterdayRegistrations > 0) {
      dailyGrowth =
        ((todayRegistrations - yesterdayRegistrations) /
          yesterdayRegistrations) *
        100;
    } else if (todayRegistrations > 0) {
      dailyGrowth = 100;
    }

    let weeklyGrowth = 0;

    if (lastWeekRegistrations > 0) {
      weeklyGrowth =
        ((weekRegistrations - lastWeekRegistrations) / lastWeekRegistrations) *
        100;
    } else if (weekRegistrations > 0) {
      weeklyGrowth = 100;
    }

    let monthlyGrowth = 0;

    if (lastMonthRegistrations > 0) {
      monthlyGrowth =
        ((monthRegistrations - lastMonthRegistrations) /
          lastMonthRegistrations) *
        100;
    } else if (monthRegistrations > 0) {
      monthlyGrowth = 100;
    }

    // Cadastros por dia da semana (últimos 7 dias)
    const registrationsByDay: RegistrationsByDay[] = [];

    for (let day = 6; day >= 0; day--) {
      const dayInTimezone = subDays(nowInTimezone, day);
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

    for (let month = 4; month >= 0; month--) {
      const monthInTimezone = subMonths(nowInTimezone, month);
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
