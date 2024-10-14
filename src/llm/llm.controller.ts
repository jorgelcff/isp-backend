import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('consultar')
  async consultar(@Body('pergunta') pergunta: string) {
    // Aqui você pode formatar a pergunta, se necessário
    const dados = await this.processarConsulta(pergunta);

    // Gera a resposta usando o LLM
    const prompt = `
    Com base nos seguintes dados: ${JSON.stringify(dados)},
    responda de forma clara e detalhada à pergunta: ${pergunta}.
    Lembre-se de que você deve usar os dados disponíveis para fundamentar sua resposta.
    `;

    const resposta = await this.llmService.queryLlm(prompt);

    return { resposta };
  }

  @Post('analisar')
  async analisar(@Body('texto') texto: string, @Body('tema') tema: string) {
    // Gera a resposta usando o LLM
    const prompt = `
    Como Analista do Instituto de Segurança pública do rio de janeiro, veja o json a seguir e responda de forma clara e detalhada acerca do tema: ${tema}.Caso precise fazer calculos a partir das chaves e valores do json faça e cite as fontes json:
    ${texto}
    `;

    const resposta = await this.llmService.queryLlm(prompt);

    return { resposta };
  }

  private async processarConsulta(pergunta: string) {
    const processResult = [];

    // Total de armas de fogo
    if (pergunta.includes('total de armas de fogo')) {
      const result = await this.prisma.armaapreendida.aggregate({
        _sum: {
          arma_fogo_arma_fabricacao_caseira: true,
          arma_fogo_carabina: true,
          arma_fogo_espingarda: true,
          arma_fogo_fuzil: true,
          arma_fogo_garrucha: true,
          arma_fogo_garruchao: true,
          arma_fogo_metralhadora: true,
          arma_fogo_outros: true,
          arma_fogo_pistola: true,
          arma_fogo_revolver: true,
          arma_fogo_submetralhadora: true,
        },
      });
      processResult.push({ totalArmasFogo: result._sum });
    }

    if (pergunta.includes('total de armas brancas')) {
      const result = await this.prisma.armaapreendida.aggregate({
        _sum: {
          arma_branca_total: true,
        },
      });
      processResult.push({
        totalArmasBrancas: result._sum.arma_branca_total || 0,
      });
    }

    if (pergunta.includes('total de artefatos explosivos')) {
      const result = await this.prisma.armaapreendida.aggregate({
        _sum: {
          artefato_explosivo_total: true,
        },
      });
      processResult.push({
        totalArtefatosExplosivos: result._sum.artefato_explosivo_total || 0,
      });
    }

    if (pergunta.includes('total de simulacros')) {
      const result = await this.prisma.armaapreendida.aggregate({
        _sum: {
          simulacro_total: true,
        },
      });
      processResult.push({ totalSimulacros: result._sum.simulacro_total || 0 });
    }

    if (pergunta.includes('apreensões por mês')) {
      const result = await this.prisma.armaapreendida.groupBy({
        by: ['mes', 'ano'],
        _sum: {
          arma_fogo_arma_fabricacao_caseira: true,
          arma_fogo_carabina: true,
          arma_fogo_espingarda: true,
          arma_fogo_fuzil: true,
          arma_fogo_garrucha: true,
          arma_fogo_garruchao: true,
          arma_fogo_metralhadora: true,
          arma_fogo_outros: true,
          arma_fogo_pistola: true,
          arma_fogo_revolver: true,
          arma_fogo_submetralhadora: true,
          arma_branca_total: true,
          artefato_explosivo_total: true,
          simulacro_total: true,
        },
      });
      processResult.push(result);
    }

    if (pergunta.includes('tendências de apreensão por ano')) {
      const result = await this.prisma.armaapreendida.groupBy({
        by: ['ano'],
        _sum: {
          arma_fogo_arma_fabricacao_caseira: true,
          arma_fogo_carabina: true,
          arma_fogo_espingarda: true,
          arma_fogo_fuzil: true,
          arma_fogo_garrucha: true,
          arma_fogo_garruchao: true,
          arma_fogo_metralhadora: true,
          arma_fogo_outros: true,
          arma_fogo_pistola: true,
          arma_fogo_revolver: true,
          arma_fogo_submetralhadora: true,
          arma_branca_total: true,
          artefato_explosivo_total: true,
          simulacro_total: true,
        },
      });
      processResult.push(result);
    }

    if (pergunta.includes('distribuição de armas por região')) {
      const result = await this.prisma.armaapreendida.groupBy({
        by: ['cisp'],
        _sum: {
          arma_fogo_total: true,
          arma_branca_total: true,
          artefato_explosivo_total: true,
          simulacro_total: true,
        },
      });
      processResult.push(result);
    }

    if (
      pergunta.includes(
        'tendência de apreensão por tipo de arma ao longo dos anos',
      )
    ) {
      const result = await this.prisma.armaapreendida.groupBy({
        by: ['ano'],
        _sum: {
          arma_fogo_total: true,
          arma_branca_total: true,
          artefato_explosivo_total: true,
          simulacro_total: true,
        },
      });
      processResult.push(result);
    }

    if (
      pergunta.includes('apreensões de armas de fogo por mês ao longo dos anos')
    ) {
      const result = await this.prisma.armaapreendida.groupBy({
        by: ['mes', 'ano'],
        _sum: {
          arma_fogo_total: true,
        },
      });
      processResult.push(result);
    }

    return { processResult };
  }
}
