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
        user: {
          include: {
            address: true,
            responsible: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (members.length === 0) {
      return left(
        ApplicationException.NotFound('Nenhum membro encontrado para exportar'),
      );
    }

    const excelData = members.map((member) => ({
      Nome: member.user?.name || '',
      Email: member.user?.email || '',
      CPF: member.cpf || '',
      RG: member.rg || '',
      'Data de Nascimento': member.birthDate
        ? new Date(member.birthDate).toLocaleDateString('pt-BR')
        : '',
      'Data de Cadastro': new Date(member.createdAt).toLocaleDateString(
        'pt-BR',
      ),
      // Endereço
      Rua: member.user?.address?.street || '',
      Número: member.user?.address?.number || '',
      Complemento: member.user?.address?.complement || '',
      Bairro: member.user?.address?.neighborhood || '',
      // Responsável (se existir)
      'Nome da Mãe': member.user?.responsible?.mother || '',
      'Nome do Pai': member.user?.responsible?.father || '',
    }));

    // Criar workbook e worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Configurar largura das colunas
    const columnWidths = [
      { wch: 25 }, // Nome
      { wch: 30 }, // Email
      { wch: 15 }, // CPF
      { wch: 15 }, // RG
      { wch: 18 }, // Data de Nascimento
      { wch: 18 }, // Data de Cadastro
      { wch: 30 }, // Rua
      { wch: 8 }, // Número
      { wch: 20 }, // Complemento
      { wch: 20 }, // Bairro
      { wch: 25 }, // Nome da Mãe
      { wch: 25 }, // Nome do Pai
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

    // Adicionar filtros automáticos
    // worksheet['!autofilter'] = { ref: worksheet['!ref'] || 'A1' };

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros');

    // Converter para buffer
    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return right(excelBuffer);
  }
}
