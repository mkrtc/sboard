import { Test, TestingModule } from '@nestjs/testing';
import { CanvasEventGateway } from './canvas-event.gateway';

describe('CanvasEventGateway', () => {
  let gateway: CanvasEventGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanvasEventGateway],
    }).compile();

    gateway = module.get<CanvasEventGateway>(CanvasEventGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
