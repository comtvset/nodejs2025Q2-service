import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'Album name',
    example: 'Abbey Road',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Year of album release',
    example: 1969,
  })
  @IsNumber()
  year: number;

  @ApiPropertyOptional({
    description: 'ID of the artist (UUID), optional',
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
  })
  @ValidateIf((o) => o.artistId !== null)
  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
