import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { IspModule } from './isp/isp.module';
//import { LlmModule } from './llm/llm.module';

@Module({
  imports: [IspModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
