import { AuthenticationMiddleware } from '@middlewares/authentication.middleware';
import UpdateUseCase from '@use-case/administrator/members/update.use-case';
import UpdateMemberSchema from '@validators/administrator/members/update';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, PATCH } from 'fastify-decorators';
import z from 'zod';

@Controller({
  route: '/administrator/members',
})
export default class UpdateController {
  constructor(
    private readonly useCase: UpdateUseCase = getInstanceByToken(UpdateUseCase),
  ) {}

  @PATCH({
    url: '/:id',
    options: {
      onRequest: [AuthenticationMiddleware],
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const schema = z.object({
      id: z.string().trim(),
    });
    const params = schema.parse(request.params);
    const payload = UpdateMemberSchema.parse(request.body);

    const result = await this.useCase.execute({
      ...payload,
      ...params,
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
