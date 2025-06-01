import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(4)
  newPassword: string;
}
