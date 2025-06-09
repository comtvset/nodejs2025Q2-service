import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}
  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: {
        id: randomUUID(),
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId,
      },
    });

    return plainToInstance(Album, newAlbum);
  }

  async findAll() {
    const albums = await this.prisma.album.findMany();
    return plainToInstance(Album, albums);
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('>>> Album not found');
    return plainToInstance(Album, album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    await this.findOne(id);

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: {
        ...updateAlbumDto,
      },
    });

    return plainToInstance(Album, updatedAlbum);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });

    await this.prisma.album.delete({ where: { id } });
  }
}
