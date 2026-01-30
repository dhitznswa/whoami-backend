import { IsString, MinLength } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @MinLength(5)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(3)
  name: string;
}
