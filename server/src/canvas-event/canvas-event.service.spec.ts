import { TestingModule } from '@nestjs/testing';
import { CanvasEventService } from './canvas-event.service';
import { createTestModule } from 'test/utils/create-test-module';
import { CanvasEventEntity } from './entities/canvas-event.entity';
import { CanvasSnapshotEntity } from './entities/canvas-snapshot.entity';
import { CanvasEventRepository } from './repositories/canvas-event.repository';
import { CanvasSnapshotRepository } from './repositories/canvas-snapshot.repository';
import { CanvasEventEnum, CanvasEventPayload, CreateEventData } from './types';
import { MoveFigureDto } from './dto/move-figure.dto';

describe('CanvasEventService', () => {
  let service: CanvasEventService;

  const mockCanvasEventRepo = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findLast: jest.fn(),
    remove: jest.fn(),
  }
  const mockCanvasSnapshotRepo = {
    create: jest.fn(),
    find: jest.fn(),
    findWithEvents: jest.fn(),
    findLast: jest.fn(),
    findById: jest.fn(),
    updateState: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await createTestModule({
      providers: [
        CanvasEventService,
        {
          provide: CanvasEventRepository,
          useValue: mockCanvasEventRepo
        },
        {
          provide: CanvasSnapshotRepository,
          useValue: mockCanvasSnapshotRepo,
        }

      ]
    })

    service = module.get<CanvasEventService>(CanvasEventService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("find last event", async () => {
    const event: CanvasEventEntity = {
      created: new Date(),
      id: "UUID",
      payload: { color: "red", id: "UUID", target: "square" } as CanvasEventPayload<CanvasEventEnum.CREATE>,
      type: CanvasEventEnum.CREATE
    }

    const snapshot: CanvasSnapshotEntity = {
      created: new Date(),
      id: "UUID",
      event: null,
      eventId: "UUID",
      state: []
    }

    mockCanvasEventRepo.findLast.mockResolvedValue(event);
    mockCanvasSnapshotRepo.findLast.mockResolvedValue(snapshot);
    mockCanvasSnapshotRepo.findWithEvents.mockResolvedValue([snapshot, [event]]);
    const lastEvent = await service.findLastEvent();
    const returnValue: CreateEventData = {
      event: event,
      canvas: [{ color: "red", id: "UUID", height: 100, width: 100, x: 0, y: 0 }]
    }

    console.log(lastEvent);
    console.log(returnValue)

    expect(lastEvent).toEqual(returnValue);
    expect(mockCanvasEventRepo.findLast).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findLast).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findWithEvents).toHaveBeenCalledTimes(1);
  })

  it("find snapshots", async () => {
    const snapshot: CanvasSnapshotEntity = {
      created: new Date(),
      id: "UUID",
      event: null,
      eventId: "UUID",
      state: []
    }


    const dto = {
      asc: true,
      ids: ["UUID"]
    }

    mockCanvasSnapshotRepo.find.mockResolvedValue(snapshot);
    const snap = await service.findSnapshots(dto);

    expect(snap).toEqual(snapshot);
    expect(mockCanvasSnapshotRepo.find).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.find).toHaveBeenCalledWith(dto);
  })

  it("find snapshot with events", async () => {
    const snapshot: CanvasSnapshotEntity = {
      created: new Date(),
      id: "UUID",
      event: null,
      eventId: "UUID",
      state: []
    }

    const events: CanvasEventEntity[] = [
      {
        created: new Date(),
        id: "UUID_1",
        payload: { color: "red", id: "UUID", target: "square" } as CanvasEventPayload<CanvasEventEnum.CREATE>,
        type: CanvasEventEnum.CREATE
      },
      {
        created: new Date(),
        id: "UUID_2",
        payload: { id: "UUID", x: 10, y: 20 } as CanvasEventPayload<CanvasEventEnum.MOVE>,
        type: CanvasEventEnum.MOVE
      }
    ]

    mockCanvasSnapshotRepo.findWithEvents.mockResolvedValue([snapshot, events]);
    const result = await service.findSnapshotWithEvents();
    expect(result).toEqual([snapshot, events]);
    expect(mockCanvasSnapshotRepo.findWithEvents).toHaveBeenCalledTimes(1);
  })

  it("find events", async () => {
    const events: CanvasEventEntity[] = [
      {
        created: new Date(),
        id: "UUID_1",
        payload: { color: "red", id: "UUID", target: "square" } as CanvasEventPayload<CanvasEventEnum.CREATE>,
        type: CanvasEventEnum.CREATE
      },
      {
        created: new Date(),
        id: "UUID_2",
        payload: { id: "UUID", x: 10, y: 20 } as CanvasEventPayload<CanvasEventEnum.MOVE>,
        type: CanvasEventEnum.MOVE
      }
    ]

    mockCanvasEventRepo.find.mockResolvedValue(events);
    const dto = { asc: true, order: "created", skip: 5 }
    const result = await service.findEvents(dto);
    expect(result).toEqual(events);
    expect(mockCanvasEventRepo.find).toHaveBeenCalledTimes(1);
    expect(mockCanvasEventRepo.find).toHaveBeenCalledWith(dto);
  })

  it("create event [CREATE]", async () => {
    const baseEvent: CanvasEventEntity = {
      created: new Date(),
      id: "UUID",
      payload: { color: "red", id: "UUID", target: "square" } as CanvasEventPayload<CanvasEventEnum.CREATE>,
      type: CanvasEventEnum.CREATE
    }


    const snapshot: CanvasSnapshotEntity = {
      created: new Date(),
      id: "UUID",
      event: null,
      eventId: "UUID",
      state: []
    }

    const events: CanvasEventEntity[] = [
      {
        created: new Date(),
        id: "UUID_1",
        payload: { color: "red", id: "UUID", target: "square" } as CanvasEventPayload<CanvasEventEnum.CREATE>,
        type: CanvasEventEnum.CREATE
      },
      {
        created: new Date(),
        id: "UUID_2",
        payload: { id: "UUID", x: 10, y: 20 } as CanvasEventPayload<CanvasEventEnum.MOVE>,
        type: CanvasEventEnum.MOVE
      }
    ]
    mockCanvasEventRepo.create.mockResolvedValue(baseEvent);
    mockCanvasSnapshotRepo.findLast.mockResolvedValue(null);
    mockCanvasSnapshotRepo.findWithEvents.mockResolvedValue([snapshot, events]);
    const event = await service.createEvent(CanvasEventEnum.CREATE);

    const returnValue = {
      event: events[1],
      canvas: [
        {
          id: "UUID",
          color: "red",
          width: 100,
          height: 100,
          x: 10,
          y: 20
        }
      ]
    }
    expect(mockCanvasEventRepo.create).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findLast).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findWithEvents).toHaveBeenCalledTimes(2);
    expect(event).toEqual(returnValue);

  })

  it("create event [MOVE]", async () => {
    const moveArg: MoveFigureDto = {
      id: "1",
      x: 5,
      y: 10
    }

    const eventEntity: CanvasEventEntity = {
      id: "EV_UUID_5",
      created: new Date(),
      type: CanvasEventEnum.MOVE,
      payload: moveArg
    }

    const snapshot: CanvasSnapshotEntity = {
      id: "SN_UUID",
      created: new Date(),
      eventId: "EV_UUID_0",
      event: eventEntity,
      state: []
    }

    const events: CanvasEventEntity[] = [
      {
        created: new Date(),
        id: "EV_UUID_0",
        payload: { color: "red", id: "1", target: "square" } as CanvasEventPayload<CanvasEventEnum.CREATE>,
        type: CanvasEventEnum.CREATE
      },
      {
        created: new Date(),
        id: "EV_UUID_1",
        payload: { color: "green", id: "2", target: "square" } as CanvasEventPayload<CanvasEventEnum.CREATE>,
        type: CanvasEventEnum.CREATE
      },
      {
        created: new Date(),
        id: "EV_UUID_2",
        payload: { id: "2", x: 10, y: 20 } as CanvasEventPayload<CanvasEventEnum.MOVE>,
        type: CanvasEventEnum.MOVE
      },
      {
        created: new Date(),
        id: "EV_UUID_3",
        payload: { id: "1", x: 15, y: 30 } as CanvasEventPayload<CanvasEventEnum.MOVE>,
        type: CanvasEventEnum.MOVE
      },
      {
        created: new Date(),
        id: "EV_UUID_4",
        payload: { id: "2", x: 150, y: 305 } as CanvasEventPayload<CanvasEventEnum.MOVE>,
        type: CanvasEventEnum.MOVE
      },
      eventEntity
    ]
    mockCanvasEventRepo.create.mockResolvedValue(eventEntity);
    mockCanvasSnapshotRepo.findLast.mockResolvedValue(snapshot);
    mockCanvasSnapshotRepo.findWithEvents.mockResolvedValue([snapshot, events]);

    const event = await service.createEvent(CanvasEventEnum.MOVE, moveArg);

    const returnValue = {
      event: eventEntity,
      canvas: [
        { id: "2", color: "green", width: 100, height: 100, x: 150, y: 305 },
        { id: "1", color: "red", width: 100, height: 100, x: 5, y: 10 }
      ]
    }

    expect(mockCanvasEventRepo.create).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findWithEvents).toHaveBeenCalledTimes(3);
    expect(mockCanvasEventRepo.create).toHaveBeenCalledWith(CanvasEventEnum.MOVE, moveArg);
    expect(event).toEqual(returnValue);
  })

  it("create event [DELETE]", async () => {
    const baseEvent: CanvasEventEntity = {
      created: new Date(),
      id: "UUID",
      payload: { id: "UUID_1" } as CanvasEventPayload<CanvasEventEnum.CREATE>,
      type: CanvasEventEnum.DELETE
    }

    const snapshot: CanvasSnapshotEntity = {
      created: new Date(),
      id: "UUID",
      event: null,
      eventId: "UUID",
      state: [{
        color: "red",
        id: "UUID_1",
        width: 100,
        height: 100,
        x: 10,
        y: 20,
      }]
    }

    const events: CanvasEventEntity[] = [
      {
        created: new Date(),
        id: "UUID_1",
        payload: { id: "UUID_1", x: 10, y: 20 } as CanvasEventPayload<CanvasEventEnum.MOVE>,
        type: CanvasEventEnum.MOVE
      },
      baseEvent
    ]

    mockCanvasEventRepo.create.mockResolvedValue(baseEvent);
    mockCanvasSnapshotRepo.findLast.mockResolvedValue(null);
    mockCanvasSnapshotRepo.findWithEvents.mockResolvedValue([snapshot, events]);
    const result = await service.createEvent(CanvasEventEnum.DELETE, { id: "UUID_1" });

    const returnValue = {
      event: baseEvent,
      canvas: []
    }

    expect(mockCanvasEventRepo.create).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findLast).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findWithEvents).toHaveBeenCalledTimes(2);
    expect(result).toEqual(returnValue);
  })

  it("create event [CLEAR]", async () => {
    const baseEvent: CanvasEventEntity = {
      created: new Date(),
      id: "UUID",
      payload: {} as CanvasEventPayload<CanvasEventEnum.CREATE>,
      type: CanvasEventEnum.CLEAR
    }

    const snapshot: CanvasSnapshotEntity = {
      created: new Date(),
      id: "UUID",
      event: null,
      eventId: "UUID",
      state: []
    }

    const events: CanvasEventEntity[] = [
      {
        created: new Date(),
        id: "UUID_1",
        payload: { id: "UUID_1", x: 10, y: 20 } as CanvasEventPayload<CanvasEventEnum.MOVE>,
        type: CanvasEventEnum.MOVE
      },
      baseEvent
    ]

    mockCanvasEventRepo.create.mockResolvedValue(baseEvent);
    mockCanvasSnapshotRepo.findLast.mockResolvedValue(null);
    mockCanvasSnapshotRepo.findWithEvents.mockResolvedValue([snapshot, events]);
    const result = await service.createEvent(CanvasEventEnum.CLEAR);

    const returnValue = {
      event: baseEvent,
      canvas: []
    }

    expect(mockCanvasEventRepo.create).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findLast).toHaveBeenCalledTimes(1);
    expect(mockCanvasSnapshotRepo.findWithEvents).toHaveBeenCalledTimes(2);
    expect(result).toEqual(returnValue);
  })
});
