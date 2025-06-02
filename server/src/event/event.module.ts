import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventGateway } from './event.gateway';
import { EventRepository } from './event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { SnapshotEntity } from './entities/snapshot.entity';

@Module({
  providers: [EventService, EventGateway, EventRepository],
  imports: [TypeOrmModule.forFeature([EventEntity, SnapshotEntity])]
})
export class EventModule {}
