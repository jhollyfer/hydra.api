import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';

@Controller({
  route: '/',
})
export default class WelcomeController {
  @GET({
    url: '/',
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    return response.status(200).send({ message: 'Welcome to the Hydra API' });
  }
}
