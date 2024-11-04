import { Injectable } from '@nestjs/common';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';

@Injectable()
export class FlowService {
  create(createFlowDto: CreateFlowDto) {
    return 'This action adds a new flow';
  }

  findAll() {
    return `This action returns all flow`;
  }

  findOne(id: string) {
    return `This action returns a #${id} flow`;
  }

  update(id: string, updateFlowDto: UpdateFlowDto) {
    return `This action updates a #${id} flow`;
  }

  remove(id: string) {
    return `This action removes a #${id} flow`;
  }
}
