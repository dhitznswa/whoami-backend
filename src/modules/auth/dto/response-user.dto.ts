import { OmitType } from '@nestjs/mapped-types';
import { CreateUsersDto } from 'src/modules/users/dto/create-users.dto';

export class ResponseUserDto extends OmitType(CreateUsersDto, [
  'password',
] as const) {}
