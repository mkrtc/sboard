import { Test, TestingModule } from '@nestjs/testing';
import { CanvasEventService } from './canvas-event.service';

describe('CanvasEventService', () => {
  let service: CanvasEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanvasEventService],
    }).compile();

    service = module.get<CanvasEventService>(CanvasEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
