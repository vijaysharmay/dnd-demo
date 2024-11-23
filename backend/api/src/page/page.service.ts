import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { JwtService } from '@nestjs/jwt';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    createPageDto: CreatePageDto,
  ) {
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    const { name, route } = createPageDto;
    const PageId = v4();
    return this.prisma.page.create({
      data: {
        id: PageId,
        name,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        route,
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

  findAll(workspaceId: string, projectId: string) {
    return this.prisma.page.findMany({
      where: {
        workspaceId,
        projectId,
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

  findOne(workspaceId: string, projectId: string, pageId: string) {
    return this.prisma.page.findFirst({
      where: {
        id: pageId,
        workspaceId,
        projectId,
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
    updatePageDto: UpdatePageDto,
  ) {
    return this.prisma.page.update({
      data: updatePageDto,
      where: {
        id: pageId,
        workspaceId,
        projectId,
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

  async remove(workspaceId: string, projectId: string, pageId: string) {
    await this.prisma.page.delete({
      where: {
        id: pageId,
        workspaceId,
        projectId,
      },
    });
    return;
  }
}
