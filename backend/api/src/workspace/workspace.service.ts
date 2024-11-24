import { Injectable } from '@nestjs/common';
import { isUndefined } from 'lodash';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { JwtService } from '@nestjs/jwt';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { RemoveMembersDto } from './dto/remove-members.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(accessToken: string, createWorkspaceDto: CreateWorkspaceDto) {
    const { name, route, members } = createWorkspaceDto;
    const { sub: ownerId } = this.jwtService.decode(accessToken);
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
        isUserWorkspace: false,
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

    for (const member of members) {
      try {
        await this.prisma.userWorkspaceRole.upsert({
          where: {
            userId_workspaceId: { userId: member.memberId, workspaceId },
          },
          update: {
            role: member.role,
          },
          create: {
            userId: member.memberId,
            workspaceId,
            role: member.role,
          },
        });
      } catch (error) {
        console.error(
          `Failed to create or connect user role for member ${member.memberId}:`,
          error,
        );
      }
    }

    return this.findOne(id);
  }

  findAll() {
    return this.prisma.workspace.findMany({
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

  getMembersInWorkspace(workspaceId: string) {
    return this.prisma.workspace.findMany({
      where: {
        id: workspaceId,
      },
      select: {
        members: {
          select: {
            user: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
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
      include: {
        owner: {
          omit: {
            passwd: true,
            salt: true,
          },
        },
        members: {
          include: {
            user: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
          omit: {
            workspaceId: true,
            userId: true,
          },
        },

        projects: {
          omit: {
            workspaceId: true,
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
              },
            },
          },
        },
      },
      omit: {
        ownerId: true,
      },
    });
  }

  async update(workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    const { members, ownerId, ...updateWorkspaceDtoWithOutMembers } =
      updateWorkspaceDto;

    const workspace = await this.findOne(workspaceId);

    if (
      !isUndefined(members) &&
      members.length > 0 &&
      workspace.isUserWorkspace === false
    ) {
      for (const member of members) {
        try {
          await this.prisma.userWorkspaceRole.upsert({
            where: {
              userId_workspaceId: { userId: member.memberId, workspaceId },
            },
            update: {
              role: member.role,
            },
            create: {
              userId: member.memberId,
              workspaceId,
              role: member.role,
            },
          });
        } catch (error) {
          console.error(
            `Failed to create or connect user role for member ${member.memberId}:`,
            error,
          );
        }
      }
    }

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
                salt: true,
              },
            },
          },
        },
      },
    });
  }

  removeMembersFromWorkspace(workspaceId: string, members: RemoveMembersDto) {
    return this.prisma.userWorkspaceRole.deleteMany({
      where: {
        workspaceId,
        userId: {
          in: members.members,
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
