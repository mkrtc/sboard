import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from './event/event.module';
import { EventEntity } from './event/entities/event.entity';
import { SnapshotEntity } from './event/entities/snapshot.entity';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWD,
      database: process.env.PG_DB,
      autoLoadEntities: true,
      synchronize: true,
      entities: [EventEntity, SnapshotEntity]
    }),
    EventModule,
  ],
})
export class AppModule {}
