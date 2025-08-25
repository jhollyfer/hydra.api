/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import { Service } from 'fastify-decorators';

import { prisma } from '@config/database';
import type { Either } from '@core/either';
import { left, right } from '@core/either';
import ApplicationException from '@exceptions/application';
import { SignInSchema } from '@validators/authentication/sign-in.validator';
import { User } from 'generated/prisma';
import z from 'zod';

type Resultado = Either<ApplicationException, User>;

@Service()
export default class SignInUseCase {
  // constructor(
  // 	private readonly repository: UserRepositoryContract = getInstanceByToken(
  // 		UserRepositoryMongoose,
  // 	),
  // ) {}

  async execute(payload: z.infer<typeof SignInSchema>): Promise<Resultado> {
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user)
      return left(ApplicationException.Unauthorized('Invalid credentials'));

    const passwordMatch = await bcrypt.compare(
      payload.password,
      user.password!,
    );

    if (!passwordMatch)
      return left(ApplicationException.Unauthorized('Invalid credentials'));

    return right(user);
  }
}
