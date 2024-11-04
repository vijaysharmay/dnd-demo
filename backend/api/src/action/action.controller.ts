import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller()
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  create(@Body() createActionDto: CreateActionDto) {
    return this.actionService.create(createActionDto);
  }

  @Get()
  findAll() {
    return this.actionService.findAll();
  }

  @Get(':actionId')
  findOne(@Param('actionId') actionId: string) {
    return this.actionService.findOne(actionId);
  }

  @Patch(':actionId')
  update(
    @Param('actionId') actionId: string,
    @Body() updateActionDto: UpdateActionDto,
  ) {
    return this.actionService.update(actionId, updateActionDto);
  }

  @Delete(':actionId')
  remove(@Param('actionId') actionId: string) {
    return this.actionService.remove(actionId);
  }
}
