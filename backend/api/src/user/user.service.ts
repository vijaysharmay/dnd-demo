import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { pbkdf2Sync, randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    const { fullName, email, passwd } = createUserDto;
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(passwd, salt, 1000, 64, 'sha512').toString('hex');

    return this.prisma.user.create({
      data: {
        id: v4(),
        fullName,
        email,
        passwd: hash,
        salt,
      },
      omit: {
        salt: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      omit: {
        passwd: true,
        salt: true,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  findOne(userId: string) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      omit: {
        passwd: true,
        salt: true,
      },
    });
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    const { fullName, email, passwd } = updateUserDto;
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName,
        passwd,
        email,
      },
      omit: {
        passwd: true,
        salt: true,
      },
    });
  }

  async remove(userId: string) {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return;
  }
}
