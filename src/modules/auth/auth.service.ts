import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(registerUserDto: RegisterUserDto) {
    if (registerUserDto.password !== registerUserDto.confirm_password)
      throw new BadRequestException(
        "Password and confirm_password don't match",
      );

    const { confirm_password: _, ...userData } = registerUserDto;

    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    userData['password'] = hashedPassword;

    const user = await this.usersService.createUser(userData);

    return user;
  }
}
