import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  findAllFavorites() {
    return this.favoriteService.findAll();
  }

  @Post('track/:id')
  addTrackToFavorites(@Param('id') id: string) {
    return this.favoriteService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrackFromFavorites(@Param('id') id: string) {
    return this.favoriteService.removeTrack(id);
  }

  @Post('album/:id')
  addAlbumToFavorites(@Param('id') id: string) {
    return this.favoriteService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbumFromFavorites(@Param('id') id: string) {
    return this.favoriteService.removeAlbum(id);
  }

  @Post('artist/:id')
  addArtistToFavorites(@Param('id') id: string) {
    return this.favoriteService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtistFromFavorites(@Param('id') id: string) {
    return this.favoriteService.removeArtist(id);
  }
}
