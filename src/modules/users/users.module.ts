import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/infrastructure/database/prisma.module';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UsersController } from 'src/modules/users/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
