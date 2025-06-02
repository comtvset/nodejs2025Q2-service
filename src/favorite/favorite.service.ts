import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { db } from 'src/db/dataBase';
import { validate as isUUID } from 'uuid';

@Injectable()
export class FavoriteService {
  findAll() {
    return {
      albums: db.albums.filter((a) => db.favorites.albums.includes(a.id)),
      artists: db.artists.filter((a) => db.favorites.artists.includes(a.id)),
      tracks: db.tracks.filter((t) => db.favorites.tracks.includes(t.id)),
    };
  }

  findOne<T extends { id: string }>(
    collection: T[],
    id: string,
    entity: string,
  ): T {
    if (!isUUID(id))
      throw new BadRequestException(`${entity} id is not valid UUID`);
    const item = collection.find((el) => el.id === id);
    if (!item) throw new UnprocessableEntityException(`${entity} not found`);
    return item;
  }

  remove(favList: string[], id: string, entity: string) {
    const index = favList.indexOf(id);
    if (index === -1) throw new NotFoundException(`${entity} is not favorite`);
    favList.splice(index, 1);
  }

  addTrack(id: string) {
    this.findOne(db.tracks, id, 'Track');
    if (!db.favorites.tracks.includes(id)) {
      db.favorites.tracks.push(id);
    }
    return { message: 'Track added to favorites' };
  }

  removeTrack(id: string) {
    this.remove(db.favorites.tracks, id, 'Track');
  }

  addAlbum(id: string) {
    this.findOne(db.albums, id, 'Album');
    if (!db.favorites.albums.includes(id)) {
      db.favorites.albums.push(id);
    }
    return { message: 'Album added to favorites' };
  }

  removeAlbum(id: string) {
    this.remove(db.favorites.albums, id, 'Album');
  }

  addArtist(id: string) {
    this.findOne(db.artists, id, 'Artist');
    if (!db.favorites.artists.includes(id)) {
      db.favorites.artists.push(id);
    }
    return { message: 'Artist added to favorites' };
  }

  removeArtist(id: string) {
    this.remove(db.favorites.artists, id, 'Artist');
  }
}
