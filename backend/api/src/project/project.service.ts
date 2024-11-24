import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { JwtService } from '@nestjs/jwt';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-Project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(
    accessToken: string,
    workspaceId: string,
    createProjectDto: CreateProjectDto,
  ) {
    const { name, route } = createProjectDto;
    const projectId = v4();
    const { sub: ownerId } = this.jwtService.decode(accessToken);
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

  async moveProjectToWorkspace(projectId: string, targetWorkspaceId: string) {
    await this.prisma.$transaction(async (tx) => {
      // Update the project to reference the new workspace
      await tx.project.update({
        where: { id: projectId },
        data: {
          workspaceId: targetWorkspaceId,
        },
      });

      // Update all related pages to the new workspace
      await tx.page.updateMany({
        where: { projectId },
        data: {
          workspaceId: targetWorkspaceId,
        },
      });

      await tx.version.updateMany({
        where: { projectId },
        data: {
          workspaceId: targetWorkspaceId,
        },
      });

      // Update all related accords to the new workspace
      await tx.accord.updateMany({
        where: { projectId },
        data: {
          workspaceId: targetWorkspaceId,
        },
      });
    });
  }
}
