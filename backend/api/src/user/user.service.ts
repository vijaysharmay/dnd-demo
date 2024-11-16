import { Injectable } from '@nestjs/common';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { DIGEST, ITERATIONS, KEYLEN } from 'src/auth/constants';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { fullName, email, passwd } = createUserDto;
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(passwd, salt, ITERATIONS, KEYLEN, DIGEST).toString(
      'hex',
    );

    const userId = v4();
    const workspaceId = v4();

    const user = await this.prisma.user.create({
      data: {
        id: userId,
        fullName,
        email,
        passwd: hash,
        salt,
      },
      omit: {
        passwd: true,
        salt: true,
      },
    });

    const workspace = await this.prisma.workspace.create({
      data: {
        id: workspaceId,
        name: `${fullName}'s Workspace`,
        isUserWorkspace: true,
        owner: { connect: { id: user.id } },
        defaultWorkspaceUserId: { connect: { id: user.id } },
      },
    });

    return await this.prisma.user.update({
      where: { id: user.id },
      data: { userWorkSpaceId: workspace.id },
      omit: {
        passwd: true,
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
