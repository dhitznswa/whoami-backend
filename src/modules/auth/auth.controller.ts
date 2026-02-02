import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { PublicAccess } from 'src/common/decorators/public-access.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { ResponseUserDto } from 'src/modules/auth/dto/response-user.dto';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/register')
  @PublicAccess()
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @Req() req: Request,
  ) {
    if (req.user)
      throw new ForbiddenException(['Forbidden,you has been login']);

    const user = await this.authService.register(registerUserDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Register user successfuly',
      data: new ResponseUserDto(user),
    };
  }

  @Post('/login')
  @PublicAccess()
  async loginUser(
    @Body() credentials: { username: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (req.user)
      throw new ForbiddenException(['Forbidden,you has been login']);

    const { userWithoutPassword, access_token } = await this.authService.login(
      credentials.username,
      credentials.password,
    );

    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
      maxAge: 3 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Login successfuly',
      data: userWithoutPassword,
    });
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logoutUser(@Res() res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Logout successfully',
    });
  }

  @Post('/session')
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@Req() req: Request) {
    if (!req.user)
      throw new UnauthorizedException(['Access denied, token is invalid']);

    return {
      statusCode: 200,
      message: 'Current user',
      data: req.user,
    };
  }
}
