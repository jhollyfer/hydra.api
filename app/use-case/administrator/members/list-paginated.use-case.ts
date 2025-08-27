import { prisma } from '@config/database';
import { Either, right } from '@core/either';
import { Paginated } from '@core/entity';
import ApplicationException from '@exceptions/application';
import { ListPaginatedSchema } from '@validators/administrator/members/list-paginated.validator';
import { Service } from 'fastify-decorators';
import { Member } from 'generated/prisma';
import z from 'zod';

type Response = Either<ApplicationException, Paginated<Member>>;

@Service()
export default class ListPaginatedUseCase {
  async execute(
    payload: z.infer<typeof ListPaginatedSchema>,
  ): Promise<Response> {
    const skip = (payload.page - 1) * payload.perPage;

    const where = {
      ...(payload.search && {
        OR: [
          {
            user: {
              OR: [
                {
                  name: {
                    contains: payload.search,
                    mode: 'insensitive' as const,
                  },
                },
                {
                  email: {
                    contains: payload.search,
                    mode: 'insensitive' as const,
                  },
                },
              ],
            },
          },
          { cpf: { contains: payload.search, mode: 'insensitive' as const } },
          { rg: { contains: payload.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const members = await prisma.member.findMany({
      take: payload.perPage,
      skip,
      where,
      include: {
        user: {
          include: {
            address: true,
            responsible: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.member.count({
      where,
    });

    const lastPage = Math.ceil(total / payload.perPage) || 1;

    const result: Paginated<Member> = {
      data: members,
      meta: {
        total,
        perPage: payload.perPage,
        currentPage: payload.page,
        lastPage,
        firstPage: 1,
      },
    };

    return right(result);
  }
}
