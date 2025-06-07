import { HttpAdapterHost } from '@nestjs/core';
import { ApiFilter } from './api.filter';
import { TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { createTestModule } from 'test/utils/create-test-module';

describe('ApiFilter', () => {
  let apiFilter: ApiFilter;
  beforeEach(async () => {
    const httpAdapter: HttpAdapterHost = {
      httpAdapter: {
        getRequestUrl: jest.fn().mockReturnValue("/path"),
        reply: jest.fn()
      }
    } as any;
    const module: TestingModule = await createTestModule({
      providers: [
        ApiFilter,
        {
          provide: HttpAdapterHost,
          useValue: httpAdapter
        }
      ],
      imports: [LoggerModule]
    });

    apiFilter = module.get<ApiFilter>(ApiFilter);
  })
  it('should be defined', () => {
    expect(apiFilter).toBeDefined();
  });
});
