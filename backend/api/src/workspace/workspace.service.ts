import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { isNull } from 'lodash';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}
  create(createWorkspaceDto: CreateWorkspaceDto) {
    const workspaceId = v4();
    return this.prisma.workspace.create({
      data: {
        id: workspaceId,
        name: createWorkspaceDto.name,
        owner: {
          connect: {
            id: createWorkspaceDto.ownerId,
          },
        },
        route: createWorkspaceDto.route,
        members: {
          connect: {
            id: createWorkspaceDto.ownerId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        route: true,
        members: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.workspace.findMany({
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        route: true,
        members: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  findOne(workspaceId: string) {
    return this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
      },
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        route: true,
        members: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  update(workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    const { members, ownerId, ...updateWorkspaceDtoWithOutMembers } =
      updateWorkspaceDto;
    const updateMembersExpr =
      members.length > 0
        ? {
            members: {
              connect: members.map((id: string) => {
                return {
                  id,
                };
              }),
            },
          }
        : {};

    const updateOwnerExpr = isNull(ownerId)
      ? {}
      : {
          owner: {
            connect: {
              id: ownerId,
            },
          },
        };
    return this.prisma.workspace.update({
      data: {
        ...updateWorkspaceDtoWithOutMembers,
        ...updateMembersExpr,
        ...updateOwnerExpr,
      },
      where: {
        id: workspaceId,
      },
      select: {
        id: true,
        name: true,
        route: true,
        members: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
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
