import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    const { fullName, email, passwd } = createUserDto;
    return this.prisma.user.create({
      data: {
        id: v4(),
        fullName,
        email,
        passwd,
      },
      omit: {
        passwd: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      omit: {
        passwd: true,
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
