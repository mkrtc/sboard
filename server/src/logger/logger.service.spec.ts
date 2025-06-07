import { TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { createTestModule } from 'test/utils/create-test-module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { LoggerController } from './logger.controller';
import { LogLevel } from './types/log-entity.interface';
import { GetLogsDto } from './dto/get-logs.dto';
import { And, In, LessThan, MoreThan } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';

describe('LoggerService', () => {
  let service: LoggerService;

  const mockLog: LogEntity = {
    id: "",
    created: new Date(),
    level: LogLevel.ERROR,
  }

  const logRepoMock = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await createTestModule({
      providers: [LoggerService, {
        provide: getRepositoryToken(LogEntity),
        useValue: logRepoMock
      }],
      controllers: [LoggerController]
    })
    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("get log by id", async () => {
    jest.spyOn(logRepoMock, "findOne").mockResolvedValue(mockLog);

    const log = await service.getLogById("");
    expect(logRepoMock.findOne).toHaveBeenCalledWith({ where: { id: "" } })
    expect(log).toEqual(mockLog);
  })

  it("get all", async () => {
    jest.spyOn(logRepoMock, "find").mockResolvedValue([mockLog]);
    jest.spyOn(logRepoMock, "count").mockResolvedValue(5);
    const dto: GetLogsDto = { limit: 5 }
    const logs = await service.getAll(dto);

    const filter = {
      where: {
        level: dto.level,
        code: dto.code,
        service: dto.service,
        method: dto.method,
        created: dto.dateFrom && dto.dateTo ?
          And (LessThan(new Date(dto.dateTo)), MoreThan(new Date(dto.dateFrom))) :
          dto.dateFrom ? MoreThan(new Date(dto.dateFrom)) :
            dto.dateTo ? LessThan(new Date(dto.dateTo)) : undefined,
      },
      order: {
        created: dto.asc ? 'ASC' : 'DESC'
      },
      take: dto.limit || 50,
      skip: dto.offset,
      select: {
        id: true,
        service: true,
        method: true,
        path: true,
        level: true,
        message: true,
        code: true,
        stack: true,
        ip: true,
        created: true,
        payload: dto.withPayload
      }
    }

    const result = {
      rows: [mockLog],
      count: 5,
      left: 1,
      page: 0,
      pagination: 1
    }
    expect(logRepoMock.count).toHaveBeenCalledWith(filter);
    expect(logRepoMock.find).toHaveBeenCalledWith(filter);
    expect(logs).toEqual(result);
  })

  it("create and save log", async () => {
    const createLogDto: CreateLogDto = {
      level: LogLevel.ERROR,
      service: "test",
      start: new Date(),
      message: "test",
      code: "EXCEPTION",
      stack: "test",
      ip: "test",
      method: "test",
      path: "test",
      payload: "test"
    }

    const entityDto: LogEntity = {
      ...createLogDto,
      created: new Date(),
      id: "test",
    }
    jest.spyOn(logRepoMock, "create").mockReturnValue(entityDto);
    jest.spyOn(logRepoMock, "save").mockResolvedValue(entityDto);

    const entity = service.createLog(createLogDto); 

    expect(logRepoMock.create).toHaveBeenCalledWith(createLogDto);
    
    const log = await service.saveLog(entity);

    expect(logRepoMock.save).toHaveBeenCalledWith(entity);
    expect(log).toEqual(entityDto);
  })

  it("get logs by level", async () => {
    jest.spyOn(logRepoMock, "find").mockResolvedValue([mockLog]);
    const logs = await service.getLogsByLevel(LogLevel.ERROR);
    expect(logRepoMock.find).toHaveBeenCalledWith({ where: { level: LogLevel.ERROR } });
    expect(logs).toEqual([mockLog]);
  })

  it("get logs by levels", async () => {
    jest.spyOn(logRepoMock, "find").mockResolvedValue([mockLog]);
    const logs = await service.getLogsByLevels([LogLevel.ERROR]);
    expect(logRepoMock.find).toHaveBeenCalledWith({ where: { level: In([LogLevel.ERROR]) } });
    expect(logs).toEqual([mockLog]);
  })
});
