import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}
  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        ownerId: createWorkspaceDto.ownerId,
        route: createWorkspaceDto.route,
      },
    });
  }

  findAll() {
    return this.prisma.workspace.findMany({
      select: {
        id: true,
        name: true,
        ownerId: true,
        route: true,
      },
    });
  }

  findOne(workspaceId: string) {
    return this.prisma.workspace.findMany({
      where: {
        id: workspaceId,
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        route: true,
      },
    });
  }

  update(workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.prisma.workspace.update({
      data: {
        name: updateWorkspaceDto.name,
        route: updateWorkspaceDto.route,
        ownerId: updateWorkspaceDto.ownerId,
      },
      where: {
        id: workspaceId,
      },
    });
  }

  remove(workspaceId: string) {
    return this.prisma.user.delete({
      where: {
        id: workspaceId,
      },
    });
  }
}
