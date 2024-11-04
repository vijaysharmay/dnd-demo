import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionService {
  create(createActionDto: CreateActionDto) {
    return 'This action adds a new action';
  }

  findAll() {
    return `This action returns all action`;
  }

  findOne(id: string) {
    return `This action returns a #${id} action`;
  }

  update(id: string, updateActionDto: UpdateActionDto) {
    return `This action updates a #${id} action`;
  }

  remove(id: string) {
    return `This action removes a #${id} action`;
  }
}
