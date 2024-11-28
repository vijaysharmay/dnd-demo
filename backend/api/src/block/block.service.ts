import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { PageVersionStatus } from '@prisma/client';
import { isNull } from 'lodash';
import { CreateBlockDto, RemoveChildrenDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}

  async setStatusLogToDraft(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
  ) {
    const versionStatusLog = await this.prisma.versionStatusLog.findFirst({
      where: {
        versionId,
        status: PageVersionStatus.PUBLISHED,
      },
      orderBy: {
        changesMadeOn: 'desc', // Ensures the latest log is retrieved
      },
    });

    if (!isNull(versionStatusLog)) {
      await this.prisma.version.update({
        where: {
          workspaceId,
          projectId,
          pageId,
          id: versionId,
        },
        data: {
          currentStatus: PageVersionStatus.DRAFT,
        },
      });

      await this.prisma.versionStatusLog.update({
        where: {
          id: versionStatusLog.id,
        },
        data: {
          status: PageVersionStatus.DRAFT,
        },
      });
    }
  }

  async create(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    createBlockDto: CreateBlockDto,
  ) {
    const { id, blockType, props } = createBlockDto;

    this.setStatusLogToDraft(workspaceId, projectId, pageId, versionId);
    return this.prisma.block.create({
      data: {
        id,
        blockType,
        props,
        version: {
          connect: {
            id: versionId,
            workspaceId,
            projectId,
            pageId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  findAll(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
  ) {
    return this.prisma.block.findMany({
      where: {
        version: {
          id: versionId,
          pageId,
          workspaceId,
          projectId,
        },
      },
    });
  }

  findOne(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    blockId: string,
  ) {
    return this.prisma.block.findFirst({
      where: {
        id: blockId,
        version: {
          id: versionId,
          pageId,
          workspaceId,
          projectId,
        },
      },
      include: {
        children: true,
      },
    });
  }

  async update(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    blockId: string,
    updateBlockDto: UpdateBlockDto,
  ) {
    return this.prisma.block.update({
      data: updateBlockDto,
      where: {
        id: blockId,
        version: {
          id: versionId,
          pageId,
          workspaceId,
          projectId,
        },
      },
    });
  }

  async addChildToBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    parentBlockId: string,
    createBlockDto: CreateBlockDto,
  ) {
    const { id, blockType, props, depth, position } = createBlockDto;
    this.setStatusLogToDraft(workspaceId, projectId, pageId, versionId);
    return this.prisma.block.update({
      data: {
        children: {
          create: {
            version: {
              connect: {
                id: versionId,
                workspaceId,
                projectId,
                pageId,
              },
            },
            blockType,
            props,
            depth,
            position,
            id,
          },
        },
      },
      where: {
        id: parentBlockId,
        version: {
          id: versionId,
          pageId,
          workspaceId,
          projectId,
        },
      },
    });
  }

  async addChildrenToBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    parentBlockId: string,
    createBlocksDto: CreateBlockDto[],
  ) {
    this.setStatusLogToDraft(workspaceId, projectId, pageId, versionId);
    return this.prisma.block.update({
      data: {
        children: {
          create: createBlocksDto.map((block) => ({
            version: {
              connect: {
                id: versionId,
                workspaceId,
                projectId,
                pageId,
              },
            },
            id: block.id,
            blockType: block.blockType,
            props: block.props,
            depth: block.depth,
            position: block.position,
          })),
        },
      },
      where: {
        id: parentBlockId,
        version: {
          id: versionId,
          pageId,
          workspaceId,
          projectId,
        },
      },
    });
  }

  async removeChildrenFromBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    parentBlockId: string,
    blockIds: RemoveChildrenDto,
  ) {
    this.setStatusLogToDraft(workspaceId, projectId, pageId, versionId);
    return this.prisma.block.update({
      data: {
        children: {
          deleteMany: {
            id: { in: blockIds.map((x) => x.id) },
          },
        },
      },
      where: {
        id: parentBlockId,
        version: {
          id: versionId,
          pageId,
          workspaceId,
          projectId,
        },
      },
    });
  }

  async removeChildFromBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    parentBlockId: string,
    blockId: string,
  ) {
    this.setStatusLogToDraft(workspaceId, projectId, pageId, versionId);
    return this.prisma.block.update({
      data: {
        children: {
          delete: {
            id: blockId,
          },
        },
      },
      where: {
        id: parentBlockId,
        version: {
          id: versionId,
          pageId,
          workspaceId,
          projectId,
        },
      },
    });
  }

  async remove(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    blockId: string,
  ) {
    this.setStatusLogToDraft(workspaceId, projectId, pageId, versionId);
    const children = await this.prisma.block.findMany({
      where: {
        parentId: blockId,
        versionId,
        version: {
          pageId,
          workspaceId,
          projectId,
        },
      },
    });

    // Recursively delete all child blocks
    for (const child of children) {
      await this.remove(workspaceId, projectId, pageId, versionId, child.id);
    }

    // Delete the parent block
    await this.prisma.block.delete({
      where: {
        id: blockId,
        version: {
          id: versionId,
          pageId,
          workspaceId,
          projectId,
        },
      },
    });
    return;
  }
}
