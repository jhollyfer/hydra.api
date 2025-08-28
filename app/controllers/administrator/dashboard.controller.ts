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
    const timezone =
      (request.headers['x-timezone'] as string) ?? 'America/Rio_Branco';

    console.log(timezone);

    const result = await this.useCase.execute(timezone);

    if (result.isLeft()) {
      return response.status(500).send();
    }

    return response.status(200).send(result.value);
  }
}
