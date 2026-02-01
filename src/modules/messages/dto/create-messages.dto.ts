import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(5)
  content: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;
}
