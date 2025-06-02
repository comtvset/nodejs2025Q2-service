import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { db } from 'src/db/dataBase';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    db.albums.push(newAlbum);
    return plainToInstance(Album, newAlbum);
  }

  findAll(): Album[] {
    return db.albums;
  }

  findOne(id: string) {
    const album = db.albums.find((a) => a.id === id);
    if (!album) throw new NotFoundException('>>> Album not found');
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const albumIndex = db.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    const updatedAlbumData = {
      ...db.albums[albumIndex],
      ...updateAlbumDto,
      id: db.albums[albumIndex].id,
      updatedAt: Date.now(),
    };

    db.albums[albumIndex] = updatedAlbumData;

    return plainToInstance(Album, db.albums[albumIndex]);
  }

  remove(id: string) {
    const album = db.albums.findIndex((a) => a.id === id);
    if (album === -1) throw new NotFoundException('>>> Album not found');

    db.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    db.albums.splice(album, 1);
  }
}
