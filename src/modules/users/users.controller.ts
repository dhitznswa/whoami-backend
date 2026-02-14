import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/check-username/:username')
  @HttpCode(HttpStatus.OK)
  async checkUsername(@Param('username') username: string) {
    await this.usersService.findUserByUsername(username);
    return {
      statusCode: 200,
      message: 'username found!',
    };
  }
}
