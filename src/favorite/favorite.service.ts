import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { validate as isUUID } from 'uuid';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const favorites = await this.prisma.favorites.findFirst();
    if (!favorites) {
      return {
        albums: [],
        artists: [],
        tracks: [],
      };
    }

    const [albums, artists, tracks] = await Promise.all([
      this.prisma.album.findMany({
        where: { id: { in: favorites.albums } },
      }),
      this.prisma.artist.findMany({
        where: { id: { in: favorites.artists } },
      }),
      this.prisma.track.findMany({
        where: { id: { in: favorites.tracks } },
      }),
    ]);

    return {
      albums,
      artists,
      tracks,
    };
  }

  private async findOne<T>(
    model: string,
    id: string,
    entity: string,
  ): Promise<T> {
    if (!isUUID(id)) {
      throw new BadRequestException(`>>> ${entity} id is not valid UUID`);
    }

    const item = await this.prisma[model].findUnique({
      where: { id },
    });

    if (!item) {
      throw new UnprocessableEntityException(`>>> ${entity} not found`);
    }

    return item;
  }

  private async removeFromFavorites(
    field: 'albums' | 'artists' | 'tracks',
    id: string,
    entity: string,
  ) {
    const favorites = await this.prisma.favorites.findFirst();

    if (!favorites || !favorites[field].includes(id)) {
      throw new NotFoundException(`>>> ${entity} is not favorite`);
    }

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        [field]: {
          set: favorites[field].filter((itemId) => itemId !== id),
        },
      },
    });
  }

  private async addToFavorites(
    field: 'albums' | 'artists' | 'tracks',
    id: string,
    entity: string,
  ) {
    await this.findOne(entity.toLowerCase(), id, entity);

    let favorites = await this.prisma.favorites.findFirst();

    if (!favorites) {
      favorites = await this.prisma.favorites.create({
        data: {
          [field]: [id],
          albums: field === 'albums' ? [id] : [],
          artists: field === 'artists' ? [id] : [],
          tracks: field === 'tracks' ? [id] : [],
        },
      });
    } else if (!favorites[field].includes(id)) {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          [field]: {
            push: id,
          },
        },
      });
    }

    return { message: `>>> ${entity} added to favorites` };
  }

  async addTrack(id: string) {
    return this.addToFavorites('tracks', id, 'Track');
  }

  async removeTrack(id: string) {
    await this.removeFromFavorites('tracks', id, 'Track');
  }

  async addAlbum(id: string) {
    return this.addToFavorites('albums', id, 'Album');
  }

  async removeAlbum(id: string) {
    await this.removeFromFavorites('albums', id, 'Album');
  }

  async addArtist(id: string) {
    return this.addToFavorites('artists', id, 'Artist');
  }

  async removeArtist(id: string) {
    await this.removeFromFavorites('artists', id, 'Artist');
  }
}
