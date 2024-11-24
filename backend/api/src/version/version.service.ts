import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { JwtService } from '@nestjs/jwt';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';

@Injectable()
export class VersionService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    pageId: string,
    createVersionDto: CreateVersionDto,
  ) {
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    const { name } = createVersionDto;
    const VersionId = v4();
    return this.prisma.version.create({
      data: {
        id: VersionId,
        name,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        page: {
          connect: {
            id: pageId,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
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

  findAll(workspaceId: string, projectId: string, pageId: string) {
    return this.prisma.version.findMany({
      where: {
        workspaceId,
        projectId,
        pageId,
      },
      include: {
        project: {
          omit: {
            ownerId: true,
            workspaceId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        workspace: {
          omit: {
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
            userWorkspaceId: true,
          },
        },
      },
      omit: {
        ownerId: true,
        projectId: true,
        workspaceId: true,
      },
    });
  }

  findOne(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
  ) {
    return this.prisma.version.findFirst({
      where: {
        id: versionId,
        workspaceId,
        projectId,
        pageId,
      },
      include: {
        project: {
          omit: {
            ownerId: true,
            workspaceId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        workspace: {
          omit: {
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        page: {
          omit: {
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
            userWorkspaceId: true,
          },
        },
        blocks: {
          include: {
            children: true,
          },
        },
      },
      omit: {
        ownerId: true,
        projectId: true,
        workspaceId: true,
      },
    });
  }

  async update(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    updateVersionDto: UpdateVersionDto,
  ) {
    const transformedData = {
      ...updateVersionDto,
      currentStatus: updateVersionDto.currentStatus
        ? { set: updateVersionDto.currentStatus }
        : undefined, // Transform only if it exists
    };
    return this.prisma.version.update({
      data: transformedData,
      where: {
        id: versionId,
        workspaceId,
        projectId,
        pageId,
      },
      include: {
        project: {
          omit: {
            ownerId: true,
            workspaceId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        workspace: {
          omit: {
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
            userWorkspaceId: true,
          },
        },
      },
      omit: {
        ownerId: true,
        projectId: true,
        workspaceId: true,
      },
    });
  }

  async remove(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
  ) {
    await this.prisma.version.delete({
      where: {
        id: versionId,
        workspaceId,
        projectId,
        pageId,
      },
    });
    return;
  }
}
