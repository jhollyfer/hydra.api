import { prisma } from '@config/database';
import { Either, left, right } from '@core/either';
import ApplicationException from '@exceptions/application';
import CreateMemberSchema from '@validators/administrator/members/create';
import { Service } from 'fastify-decorators';
import { User } from 'generated/prisma';
import z from 'zod';

type Response = Either<ApplicationException, User>;

@Service()
export default class CreateUseCase {
  async execute({
    address,
    responsible,
    name,
    role,
    ...member
  }: z.infer<typeof CreateMemberSchema>): Promise<Response> {
    const exist = await prisma.member.findUnique({
      where: {
        cpf: member.cpf,
      },
    });

    if (exist)
      return left(ApplicationException.Conflict('Member already exists'));

    const created = await prisma.user.create({
      data: {
        name,
        role,
        member: {
          create: {
            ...member,
            birthDate: new Date(member.birthDate),
          },
        },
        address: { create: address },
        responsible: { create: responsible },
      },
      include: {
        member: true,
        address: true,
        responsible: true,
      },
    });

    return right(created);
  }
}
