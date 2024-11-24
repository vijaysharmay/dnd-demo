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

import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { VersionService } from './version.service';

@Controller()
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Body() createVersionDto: CreateVersionDto,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.versionService.create(accessToken, workspaceId, projectId, pageId, createVersionDto);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
  ) {
    return this.versionService.findAll(workspaceId, projectId, pageId);
  }

  @Get(':versionId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.versionService.findOne(workspaceId, projectId, pageId, versionId);
  }

  @Patch(':versionId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
    @Body() updateVersionDto: UpdateVersionDto,
  ) {
    return this.versionService.update(
      workspaceId,
      projectId,
      pageId,
      versionId,
      updateVersionDto,
    );
  }

  @Delete(':versionId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.versionService.remove(workspaceId, projectId, pageId, versionId);
  }
}
