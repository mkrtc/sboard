import { Module } from '@nestjs/common';
import { CanvasEventService } from './canvas-event.service';
import { CanvasEventGateway } from './canvas-event.gateway';
import { CanvasEventRepository } from './canvas-event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanvasEventEntity } from './entities/canvas-event.entity';
import { SnapshotEntity } from './entities/snapshot.entity';
import { CanvasEventController } from './canvas-event.controller';

@Module({
  controllers: [CanvasEventController],
  providers: [CanvasEventService, CanvasEventGateway, CanvasEventRepository],
  imports: [TypeOrmModule.forFeature([CanvasEventEntity, SnapshotEntity])]
})
export class CanvasEventModule {}
