import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { CreateVersionDto } from './dto/create-version.dto';
import {
  AddReviewersDto,
  CloneVersionDto,
  UpdateVersionDto,
} from './dto/update-version.dto';
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
    return this.versionService.create(
      accessToken,
      workspaceId,
      projectId,
      pageId,
      createVersionDto,
    );
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
    return this.versionService.findOne(
      workspaceId,
      projectId,
      pageId,
      versionId,
    );
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

  @Patch(':versionId/clone')
  cloneVersion(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
    @Body() cloneVersionDto: CloneVersionDto,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.versionService.cloneVersion(
      accessToken,
      workspaceId,
      projectId,
      pageId,
      versionId,
      cloneVersionDto,
    );
  }

  @Get(':versionId/reviewers')
  getReviewers(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.versionService.getReviewers(
      workspaceId,
      projectId,
      pageId,
      versionId,
    );
  }

  @Put(':versionId/reviewers')
  addReviewers(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
    @Body() addReviewersDto: AddReviewersDto,
  ) {
    return this.versionService.addReviewers(
      workspaceId,
      projectId,
      pageId,
      versionId,
      addReviewersDto,
    );
  }

  @Patch(':versionId/approve')
  approveUnpublishedVersion(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.versionService.approveUnpublishedVersion(
      accessToken,
      workspaceId,
      projectId,
      pageId,
      versionId,
    );
  }

  @Patch(':versionId/reject')
  rejectUnpublishedVersion(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.versionService.rejectUnpublishedVersion(
      accessToken,
      workspaceId,
      projectId,
      pageId,
      versionId,
    );
  }

  @Patch(':versionId/publish')
  publishUnpublishedVersion(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.versionService.publishUnpublishedVersion(
      accessToken,
      workspaceId,
      projectId,
      pageId,
      versionId,
    );
  }

  @Delete(':versionId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.versionService.remove(
      workspaceId,
      projectId,
      pageId,
      versionId,
    );
  }
}
