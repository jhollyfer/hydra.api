/* eslint-disable no-unused-vars */
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { JWTPayload } from '@core/entity';
import { Env } from '@start/env';
import RefreshTokenUseCase from '@use-case/authentication/refresh-token.use-case';

@Controller({
  route: 'authentication',
})
export default class RefreshTokenController {
  constructor(
    private readonly useCase: RefreshTokenUseCase = getInstanceByToken(
      RefreshTokenUseCase,
    ),
  ) {}

  @POST({
    url: '/refresh-token',
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    try {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        return response.status(401).send({
          message: 'Refresh token não fornecido',
          code: 401,
          cause: 'MISSING_REFRESH_TOKEN',
        });
      }

      // Verifica e decodifica o refresh token
      const decoded: JWTPayload = await request.jwtVerify();

      const result = await this.useCase.execute({ userId: decoded.sub });

      if (result.isLeft()) {
        const error = result.value;

        return response.status(error.code).send({
          message: error.message,
          code: error.code,
          cause: error.cause,
        });
      }

      const user = result.value;

      // Cria novos tokens
      const jwt: JWTPayload = {
        email: user.email!,
        name: user.name,
        sub: user.id,
      };

      const newAccessToken = await response.jwtSign(jwt, {
        sub: user.id,
        expiresIn: '1d',
      });

      const newRefreshToken = await response.jwtSign(
        {
          sub: user.id,
          type: 'refresh',
        },
        {
          sub: user.id,
          expiresIn: '7d',
        },
      );

      const cookieOptions = {
        path: '/',
        secure: Env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        httpOnly: true,
      };

      // Define os novos cookies
      response
        .setCookie('accessToken', newAccessToken, {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000, // 24 horas
        })
        .setCookie('refreshToken', newRefreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        });

      return response.status(200).send({
        message: 'Tokens atualizados com sucesso',
      });
    } catch (error) {
      // Token inválido, expirado ou malformado
      return response.status(401).send({
        message: 'Refresh token inválido ou expirado',
        code: 401,
        cause: 'INVALID_REFRESH_TOKEN',
      });
    }
  }
}
