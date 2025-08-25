import { prisma } from '@config/database';
import { Either, left, right } from '@core/either';
import ApplicationException from '@exceptions/application';
import { Service } from 'fastify-decorators';
import { Member } from 'generated/prisma';

type Response = Either<ApplicationException, Member>;

@Service()
export default class GetByIdUseCase {
  async execute(payload: { id: string }): Promise<Response> {
    const member = await prisma.member.findUnique({
      where: {
        id: payload.id,
      },
      include: {
        user: {
          include: {
            address: true,
            responsible: true,
          },
        },
      },
    });

    if (!member) return left(ApplicationException.NotFound('Member not found'));

    return right(member);
  }
}
