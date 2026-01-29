import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
