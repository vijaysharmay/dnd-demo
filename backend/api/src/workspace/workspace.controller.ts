import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceService } from './workspace.service';
import { RemoveMembersDto } from './dto/remove-members.dto';

@Controller()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto);
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

  @Patch(':workspaceId/member')
  removeMembersFromWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Body() removeMembersDto: RemoveMembersDto,
  ) {
    return this.workspaceService.removeMembersFromWorkspace(workspaceId, removeMembersDto);
  }

  @Delete(':workspaceId')
  remove(@Param('workspaceId') workspaceId: string) {
    return this.workspaceService.remove(workspaceId);
  }
}
