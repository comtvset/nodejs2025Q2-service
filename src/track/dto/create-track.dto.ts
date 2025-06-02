import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;
  @ValidateIf((o) => o.artistId !== null)
  @IsUUID()
  @IsOptional()
  artistId?: string | null;
  @ValidateIf((o) => o.albumId !== null)
  @IsUUID()
  @IsOptional()
  albumId?: string | null;
  @IsNumber()
  duration: number;
}
