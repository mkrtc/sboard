import { TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';
import { LoggerModule } from './logger.module';
import { createTestModule } from 'test/utils/create-test-module';

describe('LoggerController', () => {
  let controller: LoggerController;

  beforeEach(async () => {
    const module: TestingModule = await createTestModule({
      imports: [LoggerModule]
    })

    controller = module.get<LoggerController>(LoggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
