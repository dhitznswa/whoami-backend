import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateUsersDto } from 'src/modules/users/dto/create-users.dto';

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(createUsersDto: CreateUsersDto) {
    return this.prismaService.user.create({
      data: createUsersDto,
    });
  }

  async findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }
}
