import { Test, TestingModule } from '@nestjs/testing';
import { PublishedService } from './published.service';

describe('PublishedService', () => {
  let service: PublishedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishedService],
    }).compile();

    service = module.get<PublishedService>(PublishedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
