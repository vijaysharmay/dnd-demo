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
    const { blockType, props } = createBlockDto;
    const id = v4();
    return this.prisma.block.create({
      data: {
        id,
        blockType,
        props,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
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
    blockId: string,
  ) {
    return this.prisma.block.findFirst({
      where: {
        id: blockId,
        page: {
          id: pageId,
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
    blockId: string,
    updateBlockDto: UpdateBlockDto,
  ) {
    return this.prisma.block.update({
      data: updateBlockDto,
      where: {
        id: blockId,
        page: {
          id: pageId,
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
    parentBlockUniqId: string,
    createBlockDto: CreateBlockDto,
  ) {
    const { blockType, props, depth, position } = createBlockDto;
    return this.prisma.block.update({
      data: {
        children: {
          create: {
            projectId,
            workspaceId,
            pageId,
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
            workspaceId,
            projectId,
            pageId,
            id: v4(),
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
