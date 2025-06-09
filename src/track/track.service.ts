import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';
import { Track } from './entities/track.entity';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}
  async create(createTrackDto: CreateTrackDto) {
    const newTrack = await this.prisma.track.create({
      data: {
        id: randomUUID(),
        name: createTrackDto.name,
        artistId: createTrackDto.artistId,
        albumId: createTrackDto.albumId,
        duration: createTrackDto.duration,
      },
    });

    return plainToInstance(Track, newTrack);
  }

  async findAll() {
    const tracks = await this.prisma.track.findMany();
    return plainToInstance(Track, tracks);
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException('>>> Track not found');
    return plainToInstance(Track, track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    await this.findOne(id);

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: {
        ...updateTrackDto,
      },
    });

    return plainToInstance(Track, updatedTrack);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.track.delete({ where: { id } });
  }
}
