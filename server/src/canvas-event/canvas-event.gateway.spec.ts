import { TestingModule } from '@nestjs/testing';
import { CanvasEventGateway } from './canvas-event.gateway';
import { createTestModule } from 'test/utils/create-test-module';
import { CanvasEventController } from './canvas-event.controller';
import { CanvasEventService } from './canvas-event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanvasEventEntity } from './entities/canvas-event.entity';
import { CanvasSnapshotEntity } from './entities/canvas-snapshot.entity';
import { CanvasEventRepository } from './repositories/canvas-event.repository';
import { CanvasSnapshotRepository } from './repositories/canvas-snapshot.repository';

describe('CanvasEventGateway', () => {
  let gateway: CanvasEventGateway;

  beforeEach(async () => {
    const module: TestingModule = await createTestModule({
      controllers: [CanvasEventController],
      providers: [CanvasEventService, CanvasEventGateway, CanvasEventRepository, CanvasSnapshotRepository],
      imports: [TypeOrmModule.forFeature([CanvasEventEntity, CanvasSnapshotEntity])]
    })

    gateway = module.get<CanvasEventGateway>(CanvasEventGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
