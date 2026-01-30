import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { CreateUsersDto } from 'src/modules/users/dto/create-users.dto';
import { UsersRepository } from 'src/modules/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(createUsersDto: CreateUsersDto) {
    try {
      const user = await this.usersRepository.create(createUsersDto);
      return user;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(['Username not avaliable']);
      }

      throw err;
    }
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepository.findByUsername(username);
    if (!user)
      throw new NotFoundException(["Username don't exist in the database"]);
    return user;
  }
}
