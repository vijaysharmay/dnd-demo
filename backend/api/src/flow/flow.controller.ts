import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { FlowService } from './flow.service';

@Controller()
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Post()
  create(@Body() createFlowDto: CreateFlowDto) {
    return this.flowService.create(createFlowDto);
  }

  @Get()
  findAll() {
    return this.flowService.findAll();
  }

  @Get(':flowId')
  findOne(@Param('flowId') flowId: string) {
    return this.flowService.findOne(flowId);
  }

  @Patch(':flowId')
  update(
    @Param('flowId') flowId: string,
    @Body() updateFlowDto: UpdateFlowDto,
  ) {
    return this.flowService.update(flowId, updateFlowDto);
  }

  @Delete(':flowId')
  remove(@Param('flowId') flowId: string) {
    return this.flowService.remove(flowId);
  }
}
