import { Test, TestingModule } from '@nestjs/testing';
import { AccordService } from './accord.service';

describe('AccordService', () => {
  let service: AccordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccordService],
    }).compile();

    service = module.get<AccordService>(AccordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
