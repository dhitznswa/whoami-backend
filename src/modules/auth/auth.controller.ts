import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { ResponseUserDto } from 'src/modules/auth/dto/response-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Register user successfuly',
      data: new ResponseUserDto(user),
    };
  }

  @Post('/login')
  async loginUser(
    @Body() credentials: { username: string; password: string },
    @Res() res: Response,
  ) {
    const { userWithoutPassword, access_token } = await this.authService.login(
      credentials.username,
      credentials.password,
    );

    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Login successfuly',
      data: userWithoutPassword,
    });
  }
}
