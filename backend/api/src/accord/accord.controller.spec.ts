import { Test, TestingModule } from '@nestjs/testing';
import { AccordController } from './accord.controller';
import { AccordService } from './accord.service';

describe('AccordController', () => {
  let controller: AccordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccordController],
      providers: [AccordService],
    }).compile();

    controller = module.get<AccordController>(AccordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
