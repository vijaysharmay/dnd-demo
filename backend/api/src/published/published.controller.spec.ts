import { Test, TestingModule } from '@nestjs/testing';
import { PublishedController } from './published.controller';
import { PublishedService } from './published.service';

describe('PublishedController', () => {
  let controller: PublishedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishedController],
      providers: [PublishedService],
    }).compile();

    controller = module.get<PublishedController>(PublishedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
