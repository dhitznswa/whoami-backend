import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateMessageDto } from 'src/modules/messages/dto/create-messages.dto';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class MessagesRepository {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(
    createMessagesDto: CreateMessageDto,
    username: string,
    senderIp: string,
  ) {
    const existingUser = await this.usersService.findUserByUsername(username);
    if (!existingUser)
      throw new NotFoundException(["Username doesn't exist in the database"]);

    const message = await this.prismaService.message.create({
      data: {
        userId: existingUser.id,
        senderIp,
        ...createMessagesDto,
      },
    });

    return message;
  }

  async findOne(id: string) {
    const message = await this.prismaService.message.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    return message;
  }

  async findByUsername(username: string) {
    const messages = await this.prismaService.message.findMany({
      where: {
        user: {
          username,
        },
      },
    });

    return messages;
  }

  async delete(id: string) {
    const message = this.prismaService.message.delete({ where: { id } });

    return message;
  }
}
