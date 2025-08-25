import { type FastifyReply, type FastifyRequest } from 'fastify';

import type { JWTPayload } from '@core/entity';

export async function AuthenticationMiddleware(
  request: FastifyRequest,
  response: FastifyReply,
): Promise<void> {
  try {
    // const accessToken =
    //   request.headers?.cookie?.replace(/^accessToken=/, '')?.trim() ??
    //   request.cookies?.accessToken?.trim();

    const decoded: JWTPayload = await request.jwtVerify();
    request.user = {
      sub: decoded.sub ?? undefined,
      email: decoded?.email ?? undefined,
      name: decoded?.name ?? undefined,
    };
  } catch (error) {
    console.error(error);
    return response.status(401).send({
      statusCode: 401,
      error: 'Não autorizado',
      message: 'Usuário não autenticado',
    });
  }
}
