import { Injectable } from '@nestjs/common';
import { isUndefined } from 'lodash';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}
  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const { name, ownerId, route } = createWorkspaceDto;
    const workspaceId = v4();
    const { id } = await this.prisma.workspace.create({
      data: {
        id: workspaceId,
        name,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        route,
      },
      select: {
        id: true,
      },
    });

    await this.prisma.userWorkspaceRole.create({
      data: {
        userId: ownerId,
        workspaceId: id,
        role: 'ADMIN',
      },
    });

    return this.findOne(id);
  }

  findAll() {
    return this.prisma.workspace.findMany({
      include: {
        members: {
          include: {
            user: {
              omit: {
                passwd: true,
              },
            },
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
      include: {
        members: {
          include: {
            user: {
              omit: {
                passwd: true,
              },
            },
          },
        },
      },
    });
  }

  update(workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    const { members, ownerId, ...updateWorkspaceDtoWithOutMembers } =
      updateWorkspaceDto;
    const updateMembersExpr =
      !isUndefined(members) && members.length > 0
        ? {
            members: {
              set: members.map((member) => {
                return {
                  userId_workspaceId: {
                    userId: member.memberId,
                    workspaceId,
                  },
                  role: member.role,
                };
              }),
            },
          }
        : {};
    const updateOwnerExpr = isUndefined(ownerId)
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
      include: {
        members: {
          include: {
            user: {
              omit: {
                passwd: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(workspaceId: string) {
    await this.prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    });
    return;
  }
}
