import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto, UpdateWorkspaceDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() createProjectDto: CreateProjectDto,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.projectService.create(
      accessToken,
      workspaceId,
      createProjectDto,
    );
  }

  @Get()
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.projectService.findAll(workspaceId);
  }

  @Get(':projectId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.findOne(workspaceId, projectId);
  }

  @Patch(':projectId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(workspaceId, projectId, updateProjectDto);
  }

  @Post(':projectId/move')
  moveProjectToWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateWorkspaceDto,
  ) {
    return this.projectService.moveProjectToWorkspace(
      projectId,
      updateProjectDto.newWorkspaceId,
    );
  }

  @Delete(':projectId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.remove(workspaceId, projectId);
  }
}
