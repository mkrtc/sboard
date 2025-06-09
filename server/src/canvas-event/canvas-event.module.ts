import { Module } from '@nestjs/common';
import { CanvasEventService } from './canvas-event.service';
import { CanvasEventGateway } from './canvas-event.gateway';
import { CanvasEventRepository } from './repositories/canvas-event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanvasEventEntity } from './entities/canvas-event.entity';
import { CanvasSnapshotEntity } from './entities/canvas-snapshot.entity';
import { CanvasEventController } from './canvas-event.controller';
import { CanvasSnapshotRepository } from './repositories/canvas-snapshot.repository';

@Module({
  controllers: [CanvasEventController],
  providers: [CanvasEventService, CanvasEventGateway, CanvasEventRepository, CanvasSnapshotRepository],
  imports: [TypeOrmModule.forFeature([CanvasEventEntity, CanvasSnapshotEntity])]
})
export class CanvasEventModule {}
