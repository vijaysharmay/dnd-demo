import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageService } from './page.service';

@Controller()
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }

  @Get()
  findAll() {
    return this.pageService.findAll();
  }

  @Get(':pageId')
  findOne(@Param('pageId') pageId: string) {
    return this.pageService.findOne(pageId);
  }

  @Patch(':pageId')
  update(
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pageService.update(pageId, updatePageDto);
  }

  @Delete(':pageId')
  remove(@Param('pageId') pageId: string) {
    return this.pageService.remove(pageId);
  }
}
