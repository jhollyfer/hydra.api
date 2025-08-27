import { AuthenticationMiddleware } from '@middlewares/authentication.middleware';
import DashboardStatsUseCase from '@use-case/administrator/dashboard.use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

@Controller({
  route: '/administrator/dashboard',
})
export default class DashboardController {
  constructor(
    private readonly useCase: DashboardStatsUseCase = getInstanceByToken(
      DashboardStatsUseCase,
    ),
  ) {}

  @GET({
    url: '/',
    options: {
      onRequest: [AuthenticationMiddleware],
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const result = await this.useCase.execute();

    if (result.isLeft()) {
      //   const error = result.value;

      //   return response.status(error?.code).send({
      //     message: error.message,
      //     code: error.code,
      //     cause: error.cause,
      //   });
      return response.status(500).send();
    }

    return response.status(200).send(result.value);
  }
}
