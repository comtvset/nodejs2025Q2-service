import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data: {
        id: randomUUID(),
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });
    return plainToInstance(Artist, newArtist);
  }

  async findAll() {
    const artists = await this.prisma.artist.findMany();
    return plainToInstance(Artist, artists);
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException('>>> Artist not found');
    return plainToInstance(Artist, artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    await this.findOne(id);

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: {
        ...updateArtistDto,
      },
    });

    return plainToInstance(Artist, updatedArtist);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.artist.delete({ where: { id } });
  }
}
