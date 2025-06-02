import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;
  @IsNumber()
  year: number;
  @ValidateIf((o) => o.artistId !== null)
  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
