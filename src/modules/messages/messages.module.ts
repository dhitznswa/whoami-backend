import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/infrastructure/database/prisma.module';
import { UsersModule } from 'src/modules/users/users.module';
import { MessagesRepository } from 'src/modules/messages/messages.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
