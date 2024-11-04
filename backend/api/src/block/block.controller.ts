import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Controller()
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blockService.create(createBlockDto);
  }

  @Get()
  findAll() {
    return this.blockService.findAll();
  }

  @Get(':blockId')
  findOne(@Param('blockId') blockId: string) {
    return this.blockService.findOne(blockId);
  }

  @Patch(':blockId')
  update(
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    return this.blockService.update(blockId, updateBlockDto);
  }

  @Delete(':blockId')
  remove(@Param('blockId') blockId: string) {
    return this.blockService.remove(blockId);
  }
}
