import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    const { fullName, email, passwd, role } = createUserDto;
    return this.prisma.user.create({
      data: {
        id: v4(),
        fullName,
        email,
        passwd,
        role,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });
  }

  findOne(userId: string) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    const { fullName, email, passwd, role } = updateUserDto;
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName,
        passwd,
        email,
        role,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
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
