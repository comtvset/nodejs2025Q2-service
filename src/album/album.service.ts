import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { db } from 'src/db/dataBase';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';

@Injectable()
export class AlbumService {
  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    db.albums.push(newAlbum);
    return plainToInstance(Album, newAlbum);
  }

  async findAll(): Promise<Album[]> {
    return db.albums;
  }

  async findOne(id: string) {
    const album = db.albums.find((a) => a.id === id);
    if (!album) throw new NotFoundException('>>> Album not found');
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const albumIndex = db.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`>>> Album with id ${id} not found`);
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

  async remove(id: string) {
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
