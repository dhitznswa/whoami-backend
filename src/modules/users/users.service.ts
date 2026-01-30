import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from 'src/modules/users/dto/create-users.dto';
import { UsersRepository } from 'src/modules/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(createUsersDto: CreateUsersDto) {
    const user = await this.usersRepository.create(createUsersDto);
    return user;
  }
}
