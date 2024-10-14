import { Module } from '@nestjs/common';
import { IspController } from './isp.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { IspService } from './isp.service';

@Module({
  imports: [],
  controllers: [IspController],
  providers: [IspService, PrismaService],
})
export class IspModule {}
