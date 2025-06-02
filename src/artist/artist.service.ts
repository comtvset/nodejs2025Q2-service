import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { db } from 'src/db/dataBase';
import { Artist } from './entities/artist.entity';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ArtistService {
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    db.artists.push(newArtist);
    return plainToInstance(Artist, newArtist);
  }

  async findAll(): Promise<Artist[]> {
    return db.artists;
  }

  async findOne(id: string) {
    const artist = db.artists.find((a) => a.id === id);
    if (!artist) throw new NotFoundException('>>> Artist not found');
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artistIndex = db.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException(`>>> Artist with id ${id} not found`);
    }

    const updatedArtistData = {
      ...db.artists[artistIndex],
      ...updateArtistDto,
      id: db.artists[artistIndex].id,
      updatedAt: Date.now(),
    };

    db.artists[artistIndex] = updatedArtistData;

    return plainToInstance(Artist, db.artists[artistIndex]);
  }

  async remove(id: string) {
    const artist = db.artists.findIndex((a) => a.id === id);
    if (artist === -1) throw new NotFoundException('>>> Artist not found');

    db.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    db.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    db.artists.splice(artist, 1);
  }
}
