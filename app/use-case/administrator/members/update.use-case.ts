import { prisma } from '@config/database';
import { Either, left, right } from '@core/either';
import ApplicationException from '@exceptions/application';
import UpdateMemberSchema from '@validators/administrator/members/update';
import { Service } from 'fastify-decorators';
import { User } from 'generated/prisma';
import z from 'zod';

type Response = Either<ApplicationException, User>;

@Service()
export default class UpdateUseCase {
  async execute({
    id, // id do member
    address,
    responsible,
    name,
    role,
    ...member
  }: z.infer<typeof UpdateMemberSchema> & { id: string }): Promise<Response> {
    const exist = await prisma.member.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!exist)
      return left(ApplicationException.NotFound('Membro não encontrado'));

    const updated = await prisma.user.update({
      where: { id: exist.userId! },
      data: {
        name,
        role,
        member: {
          update: {
            ...member,
            ...(member.birthDate && { birthDate: new Date(member.birthDate) }),
          },
        },
        ...(responsible && {
          responsible: {
            upsert: {
              create: responsible,
              update: responsible,
            },
          },
        }),
        ...(address && {
          address: {
            upsert: {
              create: address,
              update: address,
            },
          },
        }),
      },
      include: {
        member: true,
        address: true,
        responsible: true,
      },
    });

    return right(updated);
  }
}
