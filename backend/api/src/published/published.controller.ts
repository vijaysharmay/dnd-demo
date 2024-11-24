import { Controller, Get, Param, Query } from '@nestjs/common';

import { Public } from 'src/utils';
import { PublishedService } from './published.service';

@Controller('published')
export class PublishedController {
  constructor(private readonly publishedService: PublishedService) {}

  @Public()
  @Get(':name')
  findOne(
    @Param('name') name: string,
    @Query('versionName') versionName: string,
  ) {
    return this.publishedService.findOne(name, versionName);
  }
}
