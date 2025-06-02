import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { db } from 'src/db/dataBase';
import { randomUUID } from 'crypto';
import { Track } from './entities/track.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TrackService {
  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    };
    db.tracks.push(newTrack);
    return plainToInstance(Track, newTrack);
  }

  async findAll(): Promise<Track[]> {
    return db.tracks;
  }

  async findOne(id: string) {
    const track = db.tracks.find((t) => t.id === id);
    if (!track) throw new NotFoundException('>>> Track not found');
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const trackIndex = db.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException(`>>> Track with id ${id} not found`);
    }

    const updatedTrackData = {
      ...db.tracks[trackIndex],
      ...updateTrackDto,
      id: db.tracks[trackIndex].id,
      updatedAt: Date.now(),
    };

    db.tracks[trackIndex] = updatedTrackData;

    return plainToInstance(Track, db.tracks[trackIndex]);
  }

  async remove(id: string) {
    const track = db.tracks.findIndex((t) => t.id === id);
    if (track === -1) throw new NotFoundException('>>> Track not found');
    db.tracks.splice(track, 1);
  }
}
