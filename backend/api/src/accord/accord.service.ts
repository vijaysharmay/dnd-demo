import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { JwtService } from '@nestjs/jwt';
import { CreateAccordDto } from './dto/create-accord.dto';
import { UpdateAccordDto } from './dto/update-accord.dto';

@Injectable()
export class AccordService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    createAccordDto: CreateAccordDto,
  ) {
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    const accordId = v4();
    const {
      accordName,
      accordAPIUrl,
      accordSchema,
      accordType,
      accordVersion,
    } = createAccordDto;
    return this.prisma.accord.create({
      data: {
        id: accordId,
        accordName,
        accordAPIUrl,
        accordSchema,
        accordType,
        accordVersion,
        owner: {
          connect: {
            id: ownerId,
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

  findAll(workspaceId: string, projectId: string) {
    return this.prisma.accord.findMany({
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
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
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

  findOne(workspaceId: string, projectId: string, accordId: string) {
    return this.prisma.accord.findFirst({
      where: {
        id: accordId,
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
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
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
    accordId: string,
    updateAccordDto: UpdateAccordDto,
  ) {
    return this.prisma.accord.update({
      data: updateAccordDto,
      where: {
        id: accordId,
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
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
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

  async remove(workspaceId: string, projectId: string, accordId: string) {
    await this.prisma.accord.delete({
      where: {
        id: accordId,
        workspaceId,
        projectId,
      },
    });
    return;
  }
}