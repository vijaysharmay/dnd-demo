import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Headers
} from '@nestjs/common';

import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageService } from './page.service';

@Controller()
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() createPageDto: CreatePageDto,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.pageService.create(accessToken, workspaceId, projectId, createPageDto);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.pageService.findAll(workspaceId, projectId);
  }

  @Get(':pageId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
  ) {
    return this.pageService.findOne(workspaceId, projectId, pageId);
  }

  @Patch(':pageId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pageService.update(
      workspaceId,
      projectId,
      pageId,
      updatePageDto,
    );
  }

  @Delete(':pageId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
  ) {
    return this.pageService.remove(workspaceId, projectId, pageId);
  }
}
