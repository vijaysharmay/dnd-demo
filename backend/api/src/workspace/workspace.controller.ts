import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { RemoveMembersDto } from './dto/remove-members.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceService } from './workspace.service';

@Controller()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.workspaceService.create(accessToken, createWorkspaceDto);
  }

  @Get()
  findAll() {
    return this.workspaceService.findAll();
  }

  @Get(':workspaceId')
  findOne(@Param('workspaceId') workspaceId: string) {
    return this.workspaceService.findOne(workspaceId);
  }

  @Patch(':workspaceId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(workspaceId, updateWorkspaceDto);
  }

  @Get(':workspaceId/member')
  getMembersInWorkspace(
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.workspaceService.getMembersInWorkspace(
      workspaceId,
    );
  }

  @Patch(':workspaceId/member')
  removeMembersFromWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Body() removeMembersDto: RemoveMembersDto,
  ) {
    return this.workspaceService.removeMembersFromWorkspace(
      workspaceId,
      removeMembersDto,
    );
  }

  @Delete(':workspaceId')
  remove(@Param('workspaceId') workspaceId: string) {
    return this.workspaceService.remove(workspaceId);
  }
}
