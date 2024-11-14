import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-Project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  async create(workspaceId: string, createProjectDto: CreateProjectDto) {
    const { name, ownerId, route } = createProjectDto;
    const projectId = v4();
    return this.prisma.project.create({
      data: {
        id: projectId,
        name,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        route,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  findAll(workspaceId: string) {
    return this.prisma.project.findMany({
      where: {
        workspaceId,
      },
      include: {
        owner: {
          omit: {
            passwd: true,
            salt: true,
          },
        },
      },
      omit: {
        ownerId: true,
      },
    });
  }

  findOne(workspaceId: string, projectId: string) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
      },
      include: {
        owner: {
          omit: {
            passwd: true,
            salt: true,
          },
        },
        pages: true,
      },
      omit: {
        ownerId: true,
      },
    });
  }

  async update(
    workspaceId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    return this.prisma.project.update({
      data: updateProjectDto,
      where: {
        id: projectId,
        workspaceId,
      },
      include: {
        owner: {
          omit: {
            passwd: true,
            salt: true,
          },
        },
      },
      omit: {
        ownerId: true,
        workspaceId: true,
      },
    });
  }

  async remove(workspaceId: string, projectId: string) {
    await this.prisma.project.delete({
      where: {
        id: projectId,
        workspaceId,
      },
    });
    return;
  }
}
