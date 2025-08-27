import { AuthenticationMiddleware } from '@middlewares/authentication.middleware';
import ExportToExcelUseCase from '@use-case/administrator/members/export-to-excel.use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

@Controller({
  route: '/administrator/members',
})
export default class ExportMembersController {
  constructor(
    private readonly useCase: ExportToExcelUseCase = getInstanceByToken(
      ExportToExcelUseCase,
    ),
  ) {}

  @GET({
    url: '/export-to-excel',
    options: {
      onRequest: [AuthenticationMiddleware],
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const result = await this.useCase.execute();

    if (result.isLeft()) {
      const error = result.value;

      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    }

    const excelBuffer = result.value;

    const date = new Date()
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        second: '2-digit',
        minute: '2-digit',
        hour: '2-digit',
      })
      ?.replace(/\D/g, '');

    const filename = 'MEMBROS_'.concat(date, '.xlsx');

    response
      .header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(excelBuffer);
  }
}
