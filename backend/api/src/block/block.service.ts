import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}
  create(createBlockDto: CreateBlockDto) {
    return 'This action adds a new block';
  }

  findAll() {
    return `This action returns all block`;
  }

  findOne(id: string) {
    return `This action returns a #${id} block`;
  }

  update(id: string, updateBlockDto: UpdateBlockDto) {
    return `This action updates a #${id} block`;
  }

  remove(id: string) {
    return `This action removes a #${id} block`;
  }
}
