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

import { AccordService } from './accord.service';
import { CreateAccordDto } from './dto/create-accord.dto';
import { UpdateAccordDto } from './dto/update-accord.dto';

@Controller()
export class AccordController {
  constructor(private readonly accordService: AccordService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() createAccordDto: CreateAccordDto,
    @Headers('Authorization') authorizationHeader?: string,
  ) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.accordService.create(
      accessToken,
      workspaceId,
      projectId,
      createAccordDto,
    );
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.accordService.findAll(workspaceId, projectId);
  }

  @Get(':accordId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('accordId') accordId: string,
  ) {
    return this.accordService.findOne(workspaceId, projectId, accordId);
  }

  @Patch(':accordId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('accordId') accordId: string,
    @Body() updateAccordDto: UpdateAccordDto,
  ) {
    return this.accordService.update(
      workspaceId,
      projectId,
      accordId,
      updateAccordDto,
    );
  }

  @Delete(':accordId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('accordId') accordId: string,
  ) {
    return this.accordService.remove(workspaceId, projectId, accordId);
  }
}
