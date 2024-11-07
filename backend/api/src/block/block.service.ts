import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}
  async create(
    workspaceId: string,
    projectId: string,
    pageId: string,
    createBlockDto: CreateBlockDto,
  ) {
    const { blockId, blockType, props } = createBlockDto;
    const id = v4();
    return this.prisma.block.create({
      data: {
        id,
        blockId,
        blockType,
        props,
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
    return this.prisma.block.findMany({
      where: {
        workspaceId,
        projectId,
        pageId,
      },
    });
  }

  findOne(
    workspaceId: string,
    projectId: string,
    pageId: string,
    blockId: string,
  ) {
    return this.prisma.block.findFirst({
      where: {
        id: blockId,
        workspaceId,
        projectId,
        pageId,
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
    blockId: string,
    updateBlockDto: UpdateBlockDto,
  ) {
    return this.prisma.block.update({
      data: updateBlockDto,
      where: {
        id: blockId,
        workspaceId,
        projectId,
        pageId,
      },
    });
  }

  async addChildToBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    parentBlockId: string,
    createBlockDto: CreateBlockDto,
  ) {
    const { blockId, blockType, props } = createBlockDto;
    return this.prisma.block.update({
      data: {
        children: {
          create: {
            blockId,
            blockType,
            props,
            pageId,
            projectId,
            workspaceId,
            id: v4(),
          },
        },
      },
      where: {
        id: parentBlockId,
        workspaceId,
        projectId,
        pageId,
      },
    });
  }

  async removeChildFromBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    parentBlockId: string,
    blockId: string,
  ) {
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
        workspaceId,
        projectId,
        pageId,
      },
    });
  }

  async remove(
    workspaceId: string,
    projectId: string,
    pageId: string,
    blockId: string,
  ) {
    await this.prisma.block.delete({
      where: {
        id: blockId,
        workspaceId,
        projectId,
        pageId,
      },
    });
    return;
  }
}
