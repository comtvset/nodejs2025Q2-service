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

// !!!Service выполнят бизнес-логику и взаимодействуют с базами данных!!!
@Injectable()
export class UserService {
  private users: User[] = [];
  create(createUserDto: CreateUserDto): User {
    const timestamp = Date.now();
    const newUser: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.users.push(newUser);
    // return newUser;
    return plainToInstance(User, newUser);
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('>>> User not found');
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('>>> Old password does not match');
    }

    if (updateUserDto.oldPassword === updateUserDto.newPassword) {
      throw new ForbiddenException(
        '>>> New password must be different from the old one',
      );
    }

    user.password = updateUserDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return plainToInstance(User, user);
  }

  remove(id: string) {
    const user = this.users.findIndex((u) => u.id === id);
    if (user === -1) throw new NotFoundException('>>> User not found');
    this.users.splice(user, 1);
  }
}
