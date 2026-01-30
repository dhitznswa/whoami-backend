import { CreateUsersDto } from 'src/modules/users/dto/create-users.dto';

export class RegisterUserDto extends CreateUsersDto {
  confirm_password: string;
}
