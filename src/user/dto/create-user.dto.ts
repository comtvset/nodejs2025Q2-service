import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User login',
    example: 'john_doe',
  })
  @IsString({
    message: 'custom >>> login must be a string!',
  })
  @MinLength(2, {
    message: 'custom >>> login must be at least 2 characters long!',
  })
  login: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @MinLength(4)
  password: string;
}
