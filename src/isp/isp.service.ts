import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IspService {
  constructor(private prisma: PrismaService) {}

  async getAreas() {
    return this.prisma.arearegiao.findMany();
  }

  async createArea(data: any) {
    return this.prisma.arearegiao.create({
      data,
    });
  }

  async getArmas(page: number = 1, pageSize: number = 10, filters: any = {}) {
    const skip = (page - 1) * pageSize;

    // Cria o objeto de condições para os filtros
    const where: any = {};
    if (filters.cisp) {
      where.cisp = filters.cisp;
    }
    if (filters.aisp) {
      where.aisp = filters.aisp;
    }
    if (filters.risp) {
      where.risp = filters.risp;
    }
    if (filters.ano) {
      where.ano = filters.ano;
    }
    if (filters.mes) {
      where.mes = filters.mes;
    }

    const [totalCount, armas] = await this.prisma.$transaction([
      this.prisma.armaapreendida.count({ where }),
      this.prisma.armaapreendida.findMany({
        skip,
        take: pageSize,
        where,
      }),
    ]);

    return {
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      data: armas,
    };
  }

  async createArma(data: any) {
    // Criar a nova apreensão
    const newArma = await this.prisma.armaapreendida.create({
      data,
    });

    // Recalcular os totais após a criação
    await this.recalculateTotals(newArma.id);

    return newArma;
  }

  async updateArma(id: number, data: any) {
    // Atualizar a apreensão
    const updatedArma = await this.prisma.armaapreendida.update({
      where: { id },
      data,
    });

    // Recalcular os totais
    await this.recalculateTotals(updatedArma.id);

    return updatedArma;
  }

  private async recalculateTotals(id: number) {
    const arma = await this.prisma.armaapreendida.findUnique({
      where: { id },
    });

    if (!arma) {
      throw new Error(`Registro com ID ${id} não encontrado`);
    }

    const arma_fogo_total =
      arma.arma_fogo_arma_fabricacao_caseira +
      arma.arma_fogo_carabina +
      arma.arma_fogo_espingarda +
      arma.arma_fogo_fuzil +
      arma.arma_fogo_garrucha +
      arma.arma_fogo_garruchao +
      arma.arma_fogo_metralhadora +
      arma.arma_fogo_outros +
      arma.arma_fogo_pistola +
      arma.arma_fogo_revolver +
      arma.arma_fogo_submetralhadora;

    const simulacro_total =
      arma.simulacro_airsoft +
      arma.simulacro_arma_fabricacao_caseira +
      arma.simulacro_carabina +
      arma.simulacro_espingarda +
      arma.simulacro_fuzil +
      arma.simulacro_garrucha +
      arma.simulacro_garruchao +
      arma.simulacro_metralhadora +
      arma.simulacro_outros +
      arma.simulacro_paintball +
      arma.simulacro_pistola +
      arma.simulacro_revolver +
      arma.simulacro_submetralhadora;

    const artefato_explosivo_total =
      arma.artefato_explosivo_armadilha_explosiva +
      arma.artefato_explosivo_armadilha_incendiaria +
      arma.artefato_explosivo_bomba_fabricacao_caseira +
      arma.artefato_explosivo_granada +
      arma.artefato_explosivo_material_belico_explosivo +
      arma.artefato_explosivo_material_explosivo +
      arma.artefato_explosivo_material_explosivo_caseiro +
      arma.artefato_explosivo_material_nao_identificado;

    await this.prisma.armaapreendida.update({
      where: { id },
      data: {
        arma_fogo_total: arma_fogo_total,
        simulacro_total: simulacro_total,
        artefato_explosivo_total: artefato_explosivo_total,
        municao_total: arma.municao_total || 0,
        arma_branca_total: arma.arma_branca_total || 0,
      },
    });
  }

  async deleteArma(id: number) {
    return this.prisma.armaapreendida.delete({
      where: {
        id,
      },
    });
  }

  async getDistribuicaoArmas() {
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
        arma_fogo_total: true,
        arma_branca_total: true,
        artefato_explosivo_armadilha_explosiva: true,
        artefato_explosivo_armadilha_incendiaria: true,
        artefato_explosivo_bomba_fabricacao_caseira: true,
        artefato_explosivo_granada: true,
        artefato_explosivo_material_belico_explosivo: true,
        artefato_explosivo_material_explosivo: true,
        artefato_explosivo_material_explosivo_caseiro: true,
        artefato_explosivo_material_nao_identificado: true,
        artefato_explosivo_total: true,
        municao_total: true,
        simulacro_airsoft: true,
        simulacro_arma_fabricacao_caseira: true,
        simulacro_carabina: true,
        simulacro_espingarda: true,
        simulacro_fuzil: true,
        simulacro_garrucha: true,
        simulacro_garruchao: true,
        simulacro_metralhadora: true,
        simulacro_outros: true,
        simulacro_paintball: true,
        simulacro_pistola: true,
        simulacro_revolver: true,
        simulacro_submetralhadora: true,
        simulacro_total: true,
      },
    });

    return {
      'Total Armas de Fogo': result._sum.arma_fogo_total || 0,
      'Total Armas Brancas': result._sum.arma_branca_total || 0,
      'Total Artefatos Explosivos': result._sum.artefato_explosivo_total || 0,
      'Total Municoes': result._sum.municao_total || 0,
      'Total Simulacros': result._sum.simulacro_total || 0,
    };
  }

  async getTendencias() {
    const result = await this.prisma.armaapreendida.groupBy({
      by: ['ano'],
      _sum: {
        arma_fogo_total: true,
        arma_branca_total: true,
        artefato_explosivo_total: true,
        simulacro_total: true,
      },
    });

    return result.map((item) => ({
      ano: item.ano,
      totalArmasDeFogo: item._sum.arma_fogo_total || 0,
      totalArmasBrancas: item._sum.arma_branca_total || 0,
      totalArtefatosExplosivos: item._sum.artefato_explosivo_total || 0,
      totalSimulacros: item._sum.simulacro_total || 0,
    }));
  }

  async getApreensoesPorRegiao() {
    const grouped = await this.prisma.armaapreendida.groupBy({
      by: ['cisp'],
      _sum: {
        arma_fogo_total: true,
        arma_branca_total: true,
        artefato_explosivo_total: true,
        simulacro_total: true,
      },
    });

    const result = grouped.map((item) => ({
      região: item.cisp,
      totalArmasDeFogo: item._sum.arma_fogo_total || 0,
      totalArmasBrancas: item._sum.arma_branca_total || 0,
      totalArtefatosExplosivos: item._sum.artefato_explosivo_total || 0,
      totalSimulacros: item._sum.simulacro_total || 0,
    }));

    // Ordena os resultados pelo valor de região (cisp)
    result.sort((a, b) => Number(a.região) - Number(b.região));

    return result;
  }

  async getTiposArmasArtefatos() {
    const result = await this.prisma.armaapreendida.aggregate({
      _sum: {
        arma_fogo_total: true,
        artefato_explosivo_total: true,
        simulacro_total: true,
      },
    });

    return {
      'Total Armas de Fogo': result._sum.arma_fogo_total || 0,
      'Total Artefatos Explosivos': result._sum.artefato_explosivo_total || 0,
      'Total Simulacros': result._sum.simulacro_total || 0,
    };
  }

  async getApreensoesPorMes() {
    const result = await this.prisma.armaapreendida.groupBy({
      by: ['ano', 'mes'],
      _sum: {
        arma_fogo_total: true,
        arma_branca_total: true,
        artefato_explosivo_total: true,
        simulacro_total: true,
      },
    });

    return result.map((item) => ({
      ano: item.ano,
      mes: item.mes,
      totalArmasDeFogo: item._sum.arma_fogo_total || 0,
      totalArmasBrancas: item._sum.arma_branca_total || 0,
      totalArtefatosExplosivos: item._sum.artefato_explosivo_total || 0,
      totalSimulacros: item._sum.simulacro_total || 0,
    }));
  }

  async getTendenciasPorAno(ano: number) {
    const result = await this.prisma.armaapreendida.groupBy({
      by: ['mes'],
      where: {
        ano: Number(ano),
      },
      _sum: {
        arma_fogo_total: true,
        arma_branca_total: true,
        artefato_explosivo_total: true,
        simulacro_total: true,
      },
    });

    return result.map((item) => ({
      mes: item.mes,
      totalArmasDeFogo: item._sum.arma_fogo_total || 0,
      totalArmasBrancas: item._sum.arma_branca_total || 0,
      totalArtefatosExplosivos: item._sum.artefato_explosivo_total || 0,
      totalSimulacros: item._sum.simulacro_total || 0,
    }));
  }

  async getApreensoesPorTipo() {
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

    return {
      'Fabricação Caseira': result._sum.arma_fogo_arma_fabricacao_caseira || 0,
      Carabina: result._sum.arma_fogo_carabina || 0,
      Espingarda: result._sum.arma_fogo_espingarda || 0,
      Fuzil: result._sum.arma_fogo_fuzil || 0,
      Garrucha: result._sum.arma_fogo_garrucha || 0,
      Garruchão: result._sum.arma_fogo_garruchao || 0,
      Metralhadora: result._sum.arma_fogo_metralhadora || 0,
      Outros: result._sum.arma_fogo_outros || 0,
      Pistola: result._sum.arma_fogo_pistola || 0,
      Revólver: result._sum.arma_fogo_revolver || 0,
      Submetralhadora: result._sum.arma_fogo_submetralhadora || 0,
    };
  }

  async getApreensoesPorMesETipo() {
    const result = await this.prisma.armaapreendida.groupBy({
      by: ['ano', 'mes'],
      _sum: {
        arma_fogo_arma_fabricacao_caseira: true,
        arma_fogo_carabina: true,
      },
    });

    return result.map((item) => ({
      ano: item.ano,
      mes: item.mes,
      totalFabricaçãoCaseira: item._sum.arma_fogo_arma_fabricacao_caseira || 0,
      totalCarabina: item._sum.arma_fogo_carabina || 0,
    }));
  }

  async getComparacaoAnos() {
    const result = await this.prisma.armaapreendida.groupBy({
      by: ['ano'],
      _sum: {
        arma_fogo_total: true,
        arma_branca_total: true,
        artefato_explosivo_total: true,
      },
    });

    return result.map((item) => ({
      ano: item.ano,
      totalArmasDeFogo: item._sum.arma_fogo_total || 0,
      totalArmasBrancas: item._sum.arma_branca_total || 0,
      totalArtefatosExplosivos: item._sum.artefato_explosivo_total || 0,
    }));
  }

  async getApreensoesPorRegiaoCisp(cisp: string) {
    const result = await this.prisma.armaapreendida.findMany({
      where: {
        cisp: cisp,
      },
    });

    return {
      totalApreensoes: result.length,
    };
  }

  async getRelatorioAnual(ano: number) {
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
        arma_branca_total: true,
        artefato_explosivo_armadilha_explosiva: true,
        artefato_explosivo_armadilha_incendiaria: true,
        artefato_explosivo_bomba_fabricacao_caseira: true,
        artefato_explosivo_granada: true,
        artefato_explosivo_material_belico_explosivo: true,
        artefato_explosivo_material_explosivo: true,
        artefato_explosivo_material_explosivo_caseiro: true,
        artefato_explosivo_material_nao_identificado: true,
        municao_total: true,
        simulacro_airsoft: true,
        simulacro_arma_fabricacao_caseira: true,
        simulacro_carabina: true,
        simulacro_espingarda: true,
        simulacro_fuzil: true,
        simulacro_garrucha: true,
        simulacro_garruchao: true,
        simulacro_metralhadora: true,
        simulacro_outros: true,
        simulacro_paintball: true,
        simulacro_pistola: true,
        simulacro_revolver: true,
        simulacro_submetralhadora: true,
      },
      where: {
        ano: Number(ano),
      },
    });

    return {
      totalApreensoes:
        result._sum.arma_fogo_arma_fabricacao_caseira +
          result._sum.arma_fogo_carabina +
          result._sum.arma_fogo_espingarda +
          result._sum.arma_fogo_fuzil +
          result._sum.arma_fogo_garrucha +
          result._sum.arma_fogo_garruchao +
          result._sum.arma_fogo_metralhadora +
          result._sum.arma_fogo_outros +
          result._sum.arma_fogo_pistola +
          result._sum.arma_fogo_revolver +
          result._sum.arma_fogo_submetralhadora || 0,
      totalArmasDeFogo: result._sum.arma_fogo_arma_fabricacao_caseira || 0,
      totalArmasBrancas: result._sum.arma_branca_total || 0,
      totalArtefatosExplosivos:
        result._sum.artefato_explosivo_armadilha_explosiva +
          result._sum.artefato_explosivo_armadilha_incendiaria +
          result._sum.artefato_explosivo_bomba_fabricacao_caseira +
          result._sum.artefato_explosivo_granada +
          result._sum.artefato_explosivo_material_belico_explosivo +
          result._sum.artefato_explosivo_material_explosivo +
          result._sum.artefato_explosivo_material_explosivo_caseiro +
          result._sum.artefato_explosivo_material_nao_identificado || 0,
      totalMunicoes: result._sum.municao_total || 0,
      // Adicione outras somas conforme necessário
    };
  }
}
