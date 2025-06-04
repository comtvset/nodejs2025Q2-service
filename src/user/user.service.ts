import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { db } from 'src/db/dataBase';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    const timestamp = Date.now();
    const newUser: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    db.users.push(newUser);
    return plainToInstance(User, newUser);
  }

  async findAll(): Promise<User[]> {
    return plainToInstance(User, db.users);
  }

  async findOne(id: string) {
    const user = db.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('>>> User not found');
    return plainToInstance(User, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);

    if ((await user).password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('>>> Old password does not match');
    }

    if (updateUserDto.oldPassword === updateUserDto.newPassword) {
      throw new ForbiddenException(
        '>>> New password must be different from the old one',
      );
    }

    (await user).password = updateUserDto.newPassword;
    (await user).version += 1;
    (await user).updatedAt = Date.now();
    return plainToInstance(User, user);
  }

  async remove(id: string) {
    const user = db.users.findIndex((u) => u.id === id);
    if (user === -1) throw new NotFoundException('>>> User not found');
    db.users.splice(user, 1);
  }
}
