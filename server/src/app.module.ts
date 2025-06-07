import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CanvasEventModule } from './canvas-event/canvas-event.module';
import { CanvasEventEntity } from './canvas-event/entities/canvas-event.entity';
import { SnapshotEntity } from './canvas-event/entities/snapshot.entity';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiInterceptor } from './api/api.interceptor';
import { ApiFilter } from './api/api.filter';
import { LoggerModule } from './logger/logger.module';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: ApiFilter
    }
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    DatabaseModule.register([CanvasEventEntity, SnapshotEntity]),
    CanvasEventModule,
    LoggerModule
  ],
})
export class AppModule {}
