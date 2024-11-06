import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}
  create(createPageDto: CreatePageDto) {
    return 'This action adds a new page';
  }

  findAll() {
    return `This action returns all page`;
  }

  findOne(id: string) {
    return `This action returns a #${id} page`;
  }

  update(id: string, updatePageDto: UpdatePageDto) {
    return `This action updates a #${id} page`;
  }

  remove(id: string) {
    return `This action removes a #${id} page`;
  }
}
