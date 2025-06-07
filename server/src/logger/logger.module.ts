import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  imports: [
      TypeOrmModule.forFeature([LogEntity])
  ],
  exports: [LoggerService]
})
export class LoggerModule { }
