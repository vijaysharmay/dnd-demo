import { Controller, Get, Param } from '@nestjs/common';

import { PublishedService } from './published.service';
import { Public } from 'src/utils';

@Controller('published')
export class PublishedController {
  constructor(private readonly publishedService: PublishedService) {}

  @Public()
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.publishedService.findOne(name);
  }
}
