import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { ResponseUserDto } from 'src/modules/auth/dto/response-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
