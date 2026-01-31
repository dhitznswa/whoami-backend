import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from 'src/modules/auth/interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  async login(username: string, password: string) {
    try {
      const user = await this.usersService.findUserByUsername(username);
      const passwordCheck = await bcryptjs.compare(password, user.password);
      if (!passwordCheck) throw new UnauthorizedException();

      const payload: JwtPayloadInterface = {
        sub: user.id,
        name: user.name,
        username: user.username,
      };

      const access_token = await this.jwtService.signAsync(payload);

      const { password: _, ...userWithoutPassword } = user;

      return { userWithoutPassword, access_token };
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof UnauthorizedException
      )
        throw new UnauthorizedException(['Invalid credentials']);

      throw err;
    }
  }
}
