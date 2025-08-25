import { AuthenticationMiddleware } from '@middlewares/authentication.middleware';
import ListPaginatedUseCase from '@use-case/administrator/members/list-paginated.use-case';
import { ListPaginatedSchema } from '@validators/administrator/members/list-paginated.validator';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

@Controller({
  route: '/administrator/members',
})
export default class ListPaginatedController {
  constructor(
    private readonly useCase: ListPaginatedUseCase = getInstanceByToken(
      ListPaginatedUseCase,
    ),
  ) {}

  @GET({
    url: '/paginated',
    options: {
      onRequest: [AuthenticationMiddleware],
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const payload = ListPaginatedSchema.parse(request.query);

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
