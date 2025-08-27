// Use Case - get-dashboard-stats.use-case.ts
import { prisma } from '@config/database';
import { Either, right } from '@core/either';
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
  async execute(): Promise<Response> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total de membros
    const totalMembers = await prisma.member.count();

    // Cadastros de hoje
    const todayRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    });

    // Cadastros de ontem
    const yesterdayRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: startOfYesterday,
          lt: startOfToday,
        },
      },
    });

    // Cadastros desta semana
    const weekRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: startOfWeek,
        },
      },
    });

    // Cadastros da semana passada
    const lastWeekRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: startOfLastWeek,
          lt: startOfWeek,
        },
      },
    });

    // Cadastros deste mês
    const monthRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Cadastros do mês passado
    const lastMonthRegistrations = await prisma.member.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
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
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(startOfToday);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await prisma.member.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      registrationsByDay.push({
        date: dayNames[date.getDay()],
        count,
      });
    }

    // Tendência mensal (últimos 5 meses)
    const monthlyTrend: MonthlyTrend[] = [];
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    for (let i = 4; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        1,
      );

      const members = await prisma.member.count({
        where: {
          createdAt: {
            lt: nextMonth,
          },
        },
      });

      monthlyTrend.push({
        month: monthNames[monthDate.getMonth()],
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
