import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectService.create(workspaceId, createProjectDto);
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

  @Delete(':projectId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.remove(workspaceId, projectId);
  }
}
