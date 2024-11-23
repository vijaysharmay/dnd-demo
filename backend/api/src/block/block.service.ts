import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { CreateBlockDto, RemoveChildrenDto } from './dto/create-block.dto';
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
    const { blockUniqId, blockType, props } = createBlockDto;
    const id = v4();
    return this.prisma.block.create({
      data: {
        id,
        blockUniqId,
        blockType,
        props,
        page: {
          connect: {
            id: pageId,
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
        page: {
          id: pageId,
        },
      },
    });
  }

  findOne(
    workspaceId: string,
    projectId: string,
    pageId: string,
    blockUniqId: string,
  ) {
    return this.prisma.block.findFirst({
      where: {
        id: blockUniqId,
        page: {
          id: pageId,
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
    blockUniqId: string,
    updateBlockDto: UpdateBlockDto,
  ) {
    return this.prisma.block.update({
      data: updateBlockDto,
      where: {
        id: blockUniqId,
        page: {
          id: pageId,
        },
      },
    });
  }

  async addChildToBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    parentBlockUniqId: string,
    createBlockDto: CreateBlockDto,
  ) {
    const { blockUniqId, blockType, props, depth, position } = createBlockDto;
    return this.prisma.block.update({
      data: {
        children: {
          create: {
            blockUniqId,
            blockType,
            props,
            depth,
            position,
            id: v4(),
          },
        },
      },
      where: {
        id: parentBlockUniqId,
        page: {
          id: pageId,
        },
      },
    });
  }

  async addChildrenToBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    parentBlockUniqId: string,
    createBlocksDto: CreateBlockDto[],
  ) {
    return this.prisma.block.update({
      data: {
        children: {
          create: createBlocksDto.map((block) => ({
            id: v4(),
            blockUniqId: block.blockUniqId,
            blockType: block.blockType,
            props: block.props,
            depth: block.depth,
            position: block.position,
          })),
        },
      },
      where: {
        id: parentBlockUniqId,
        page: {
          id: pageId,
        },
      },
    });
  }

  async removeChildrenFromBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    parentBlockUniqId: string,
    blockIds: RemoveChildrenDto,
  ) {
    return this.prisma.block.update({
      data: {
        children: {
          deleteMany: {
            id: { in: blockIds.map((x) => x.id) },
          },
        },
      },
      where: {
        id: parentBlockUniqId,
        page: {
          id: pageId,
        },
      },
    });
  }

  async removeChildFromBlock(
    workspaceId: string,
    projectId: string,
    pageId: string,
    parentBlockUniqId: string,
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
        id: parentBlockUniqId,
        page: {
          id: pageId,
        },
      },
    });
  }

  async remove(
    workspaceId: string,
    projectId: string,
    pageId: string,
    blockUniqId: string,
  ) {
    await this.prisma.block.delete({
      where: {
        id: blockUniqId,
        page: {
          id: pageId,
        },
      },
    });
    return;
  }
}
