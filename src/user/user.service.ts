import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const timestamp = Date.now();
    const newUser = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });
    return plainToInstance(User, newUser);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return plainToInstance(User, users);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('>>> User not found');
    return plainToInstance(User, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('>>> Old password does not match');
    }

    if (updateUserDto.oldPassword === updateUserDto.newPassword) {
      throw new ForbiddenException(
        '>>> New password must be different from the old one',
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updateUserDto.newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      },
    });
    return plainToInstance(User, updatedUser);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }
}
