import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { IspService } from './isp.service';
import { ApiTags, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('ISP - Armas e Areas')
@Controller('isp')
export class IspController {
  constructor(private ispService: IspService) {}

  @Get('areas')
  @ApiResponse({ status: 200, description: 'Retorna todas as áreas.' })
  async getAreas() {
    return this.ispService.getAreas();
  }

  @Post('areas')
  @ApiResponse({ status: 201, description: 'Cria uma nova área.' })
  async createArea(@Body() data: any) {
    return this.ispService.createArea(data);
  }

  @Get('armas')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Tamanho da página',
  })
  @ApiQuery({
    name: 'cisp',
    required: false,
    type: String,
    description: 'Código CISP',
  })
  @ApiQuery({
    name: 'aisp',
    required: false,
    type: String,
    description: 'Código AISP',
  })
  @ApiQuery({
    name: 'risp',
    required: false,
    type: String,
    description: 'Código RISP',
  })
  @ApiQuery({
    name: 'ano',
    required: false,
    type: Number,
    description: 'Ano da apreensão',
  })
  @ApiQuery({
    name: 'mes',
    required: false,
    type: Number,
    description: 'Mês da apreensão',
  })
  @ApiResponse({ status: 200, description: 'Retorna uma lista de armas.' })
  async getArmas(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('cisp') cisp?: string,
    @Query('aisp') aisp?: string,
    @Query('risp') risp?: string,
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
  ) {
    const filters = {
      cisp: cisp || undefined,
      aisp: aisp || undefined,
      risp: risp || undefined,
      ano: ano ? Number(ano) : undefined,
      mes: mes ? Number(mes) : undefined,
    };

    return this.ispService.getArmas(Number(page), Number(pageSize), filters);
  }

  @Post('armas')
  @ApiResponse({ status: 201, description: 'Cria uma nova apreensão.' })
  async createArma(@Body() data: any) {
    return this.ispService.createArma(data);
  }

  @Put('armas/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'ID da apreensão a ser atualizada',
  })
  @ApiResponse({
    status: 200,
    description: 'Atualiza uma apreensão existente.',
  })
  async updateArma(@Param('id') id: string, @Body() data: any) {
    return this.ispService.updateArma(+id, data);
  }

  @Delete('armas/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'ID da apreensão a ser deletada',
  })
  @ApiResponse({ status: 204, description: 'Deleta uma apreensão.' })
  async deleteArma(@Param('id') id: string) {
    return this.ispService.deleteArma(+id);
  }

  @Get('armas/totalDistribuicao')
  @ApiResponse({
    status: 200,
    description: 'Retorna a distribuição total de armas.',
  })
  async getDistribuicaoArmas() {
    return this.ispService.getDistribuicaoArmas();
  }

  @Get('armas/tendencias')
  @ApiResponse({
    status: 200,
    description: 'Retorna tendências de apreensões.',
  })
  async getTendencias() {
    return this.ispService.getTendencias();
  }

  @Get('armas/apreensoesPorRegiao')
  @ApiResponse({ status: 200, description: 'Retorna apreensões por região.' })
  async getApreensoesPorRegiao() {
    return this.ispService.getApreensoesPorRegiao();
  }

  @Get('armas/tiposArmasArtefatos')
  @ApiResponse({
    status: 200,
    description: 'Retorna os tipos de armas e artefatos.',
  })
  async getTiposArmasArtefatos() {
    return this.ispService.getTiposArmasArtefatos();
  }

  @Get('armas/apreensoesPorMes')
  @ApiResponse({ status: 200, description: 'Retorna apreensões por mês.' })
  async getApreensoesPorMes() {
    return this.ispService.getApreensoesPorMes();
  }

  @Get('armas/tendenciasPorAno/:ano')
  @ApiParam({
    name: 'ano',
    required: true,
    type: Number,
    description: 'Ano para consultar tendências.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna tendências para um ano específico.',
  })
  async getTendenciasPorAno(@Param('ano') ano: number) {
    return this.ispService.getTendenciasPorAno(ano);
  }

  @Get('armas/apreensoesPorTipo')
  @ApiResponse({ status: 200, description: 'Retorna apreensões por tipo.' })
  async getApreensoesPorTipo() {
    return this.ispService.getApreensoesPorTipo();
  }

  @Get('armas/apreensoesPorMesETipo')
  @ApiResponse({
    status: 200,
    description: 'Retorna apreensões por mês e tipo.',
  })
  async getApreensoesPorMesETipo() {
    return this.ispService.getApreensoesPorMesETipo();
  }

  @Get('armas/comparacaoAnos')
  @ApiResponse({
    status: 200,
    description: 'Retorna comparação de apreensões entre anos.',
  })
  async getComparacaoAnos() {
    return this.ispService.getComparacaoAnos();
  }

  @Get('armas/apreensoesPorRegiao/:cisp')
  @ApiParam({
    name: 'cisp',
    required: true,
    type: String,
    description: 'Código CISP para filtrar',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna apreensões por região específica.',
  })
  async getApreensoesPorRegiaoCisp(@Param('cisp') cisp: string) {
    return this.ispService.getApreensoesPorRegiaoCisp(cisp);
  }

  @Get('armas/relatorioAnual/:ano')
  @ApiParam({
    name: 'ano',
    required: true,
    type: Number,
    description: 'Ano para o relatório anual.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna o relatório anual para um ano específico.',
  })
  async getRelatorioAnual(@Param('ano') ano: number) {
    return this.ispService.getRelatorioAnual(ano);
  }
}
