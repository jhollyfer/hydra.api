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
        rg: member.rg,
      },
    });

    if (exist)
      return left(
        ApplicationException.Conflict(
          'Member already exists',
          'MEMBER_ALREADY_EXISTS',
        ),
      );

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
        responsible: { create: responsible },
        ...(address && { address: { create: address } }),
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
