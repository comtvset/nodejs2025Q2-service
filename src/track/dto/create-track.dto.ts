import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({
    description: 'Track name',
    example: 'Let It Be',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'ID of the artist (UUID), optional',
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
  })
  @ValidateIf((o) => o.artistId !== null)
  @IsUUID()
  @IsOptional()
  artistId?: string | null;

  @ApiPropertyOptional({
    description: 'ID of the album (UUID), optional',
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
  })
  @ValidateIf((o) => o.albumId !== null)
  @IsUUID()
  @IsOptional()
  albumId?: string | null;

  @ApiProperty({
    description: 'Duration of the track in seconds',
    example: 240,
  })
  @IsNumber()
  duration: number;
}
