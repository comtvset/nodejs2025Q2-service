import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'custom >>> login must be a string!',
  })
  @MinLength(2, {
    message: 'custom >>> login must be at least 2 characters long!',
  })
  login: string;

  @IsString()
  @MinLength(4)
  password: string;
}
