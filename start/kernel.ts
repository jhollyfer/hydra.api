import 'reflect-metadata';

import ApplicationException from '@exceptions/application';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';
import fastify from 'fastify';
import { bootstrap } from 'fastify-decorators';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { resolve } from 'path';
import { ZodError } from 'zod';

import { Env } from './env';

export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

const kernel = fastify({
  logger: false,
}).withTypeProvider<ZodTypeProvider>();

kernel.setValidatorCompiler(validatorCompiler);
kernel.setSerializerCompiler(serializerCompiler);

kernel.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://www.manganga.maiyu.com.br',
      'http://localhost:5173',
    ];

    // Permitir requisições sem origin (ex: Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  preflight: true,
});

kernel.register(cookie, {
  secret: Env.COOKIE_SECRET,
});

const expiresIn = 60 * 60 * 24 * 1; // 1 day

kernel.register(jwt, {
  secret: {
    private: Buffer.from(Env.JWT_PRIVATE_KEY, 'base64'),
    public: Buffer.from(Env.JWT_PUBLIC_KEY, 'base64'),
  },
  sign: { expiresIn: expiresIn, algorithm: 'RS256' },
  verify: { algorithms: ['RS256'] },
  cookie: {
    signed: false,
    cookieName: 'accessToken',
  },
});

kernel.setErrorHandler((error, request, response) => {
  console.error('Error details:', JSON.stringify(error, null, 2));
  console.error('Request URL:', request.url);
  console.error('Request method:', request.method);
  console.error('Request headers:', request.headers);

  if (error instanceof ApplicationException) {
    return response.status(Number(error.code || 500)).send({
      message: error.message || 'Internal Server Error',
      cause: error.cause || 'SERVER_ERROR',
      code: Number(error.code || 500),
    });
  }

  if (error instanceof ZodError) {
    const errors = error?.issues?.map((issue) => ({
      message: issue.message,
    }));
    return response.status(400).send({ errors });
  }

  return response.status(500).send({ message: 'Internal server error' });
});

kernel.register(bootstrap, {
  directory: resolve(__dirname, '..', 'app', 'controllers'),
  mask: /\.controller\.(t|j)s$/,
});

export { kernel };
