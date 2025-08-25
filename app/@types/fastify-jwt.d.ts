import type { JWTPayload } from '@core/entity';

import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: JWTPayload;
  }
}
