import { AuthenticationMiddleware } from '@middlewares/authentication.middleware';
import GetByIdUseCase from '@use-case/administrator/members/get-by-id.use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';
import z from 'zod';

@Controller({
  route: '/administrator/members',
})
export default class GetByIdController {
  constructor(
    private readonly useCase: GetByIdUseCase = getInstanceByToken(
      GetByIdUseCase,
    ),
  ) {}

  @GET({
    url: '/:id',
    options: {
      onRequest: [AuthenticationMiddleware],
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const schema = z.object({
      id: z.string().trim(),
    });

    const payload = schema.parse(request.params);

    const result = await this.useCase.execute({
      ...payload,
    });

    if (result.isLeft()) {
      const error = result.value;

      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    }

    return response.status(200).send(result.value);
  }
}
