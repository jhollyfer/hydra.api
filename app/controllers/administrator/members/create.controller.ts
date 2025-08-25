import { AuthenticationMiddleware } from '@middlewares/authentication.middleware';
import CreateUseCase from '@use-case/administrator/members/create.use-case';
import CreateMemberSchema from '@validators/administrator/members/create';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

@Controller({
  route: '/administrator/members',
})
export default class CreateController {
  constructor(
    private readonly useCase: CreateUseCase = getInstanceByToken(CreateUseCase),
  ) {}

  @POST({
    url: '/',
    options: {
      onRequest: [AuthenticationMiddleware],
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const payload = CreateMemberSchema.parse(request.body);
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
