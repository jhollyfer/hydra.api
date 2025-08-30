import { prisma } from '@config/database';
import { Either, left, right } from '@core/either';
import ApplicationException from '@exceptions/application';
import { Service } from 'fastify-decorators';
import * as XLSX from 'xlsx';

type Response = Either<ApplicationException, Buffer>;

@Service()
export default class ExportToExcelUseCase {
  async execute(): Promise<Response> {
    const members = await prisma.member.findMany({
      include: {
        user: true,
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    if (members.length === 0) {
      return left(
        ApplicationException.NotFound('Nenhum membro encontrado para exportar'),
      );
    }

    const excelData = members.map((member, index) => ({
      'N°': index + 1,
      'Nome Completo': member.user?.name ?? '',
      'CPF/RG': member.rg ?? '',
      Assinatura: '',
    }));

    // Criar workbook e worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Configurar largura das colunas
    const columnWidths = [
      { wch: 5 }, // Número
      { wch: 30 }, // Nome Completo
      { wch: 20 }, // CPF/RG
      { wch: 25 }, // Assinatura
    ];

    worksheet['!cols'] = columnWidths;

    // Configurar estilo do cabeçalho
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '4472C4' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros');

    // Converter para buffer
    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return right(excelBuffer);
  }
}
