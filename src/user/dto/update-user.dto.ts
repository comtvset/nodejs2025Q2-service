import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'oldPass123',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password for the user, minimum length 4',
    example: 'newPass456',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  newPassword: string;
}
