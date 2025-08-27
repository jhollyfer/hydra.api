/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';

import { prisma } from '@config/database';
import type { Either } from '@core/either';
import { left, right } from '@core/either';
import ApplicationException from '@exceptions/application';
import { User } from 'generated/prisma';

interface RefreshTokenUseCaseRequest {
  userId: string;
}

type Resultado = Either<ApplicationException, User>;

@Service()
export default class RefreshTokenUseCase {
  async execute({ userId }: RefreshTokenUseCaseRequest): Promise<Resultado> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return left(ApplicationException.Unauthorized('Token inválido'));
    }

    // Opcional: verificar se o usuário ainda está ativo
    // if (!user.active) {
    //   return left(ApplicationException.Unauthorized('Usuário inativo'));
    // }

    return right(user);
  }
}
