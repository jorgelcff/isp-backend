import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [LlmController],
  providers: [LlmService, PrismaService],
})
export class LlmModule {}
