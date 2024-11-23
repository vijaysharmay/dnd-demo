import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { BlockService } from './block.service';
import { CreateBlockDto, RemoveChildrenDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Controller()
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Body() createBlockDto: CreateBlockDto,
  ) {
    return this.blockService.create(
      workspaceId,
      projectId,
      pageId,
      createBlockDto,
    );
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
  ) {
    return this.blockService.findAll(workspaceId, projectId, pageId);
  }

  @Get(':blockId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('blockId') blockId: string,
  ) {
    return this.blockService.findOne(workspaceId, projectId, pageId, blockId);
  }

  @Patch(':blockId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    return this.blockService.update(
      workspaceId,
      projectId,
      pageId,
      blockId,
      updateBlockDto,
    );
  }

  @Delete(':blockId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('blockId') blockId: string,
  ) {
    return this.blockService.remove(workspaceId, projectId, pageId, blockId);
  }

  @Put(':blockId/child')
  addChildToBlock(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('blockId') blockId: string,
    @Body() createBlockDto: CreateBlockDto,
  ) {
    return this.blockService.addChildToBlock(
      workspaceId,
      projectId,
      pageId,
      blockId,
      createBlockDto,
    );
  }

  @Delete(':blockId/child')
  removeChildFromBlock(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('parentBlockId') parentBlockId: string,
    @Param('blockId') blockId: string,
  ) {
    return this.blockService.removeChildFromBlock(
      workspaceId,
      projectId,
      pageId,
      parentBlockId,
      blockId,
    );
  }

  @Put(':blockId/child/bulk')
  addChildrenToBlock(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('blockId') blockId: string,
    @Body() createBlocksDto: CreateBlockDto[],
  ) {
    return this.blockService.addChildrenToBlock(
      workspaceId,
      projectId,
      pageId,
      blockId,
      createBlocksDto,
    );
  }

  @Delete(':blockId/child/bulk')
  removeChildrenFromBlock(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('blockId') blockId: string,
    @Body() removeChildrenDto: RemoveChildrenDto,
  ) {
    return this.blockService.removeChildrenFromBlock(
      workspaceId,
      projectId,
      pageId,
      blockId,
      removeChildrenDto,
    );
  }
}
