import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CanvasEventModule } from './canvas-event/canvas-event.module';
import { CanvasEventEntity } from './canvas-event/entities/canvas-event.entity';
import { CanvasSnapshotEntity } from './canvas-event/entities/canvas-snapshot.entity';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    DatabaseModule.register([CanvasEventEntity, CanvasSnapshotEntity]),
    CanvasEventModule,
  ],
})
export class AppModule {}
