import { createTestModule } from "test/utils/create-test-module";
import { CanvasSnapshotRepository } from "./canvas-snapshot.repository"
import { CanvasSnapshotEntity } from "../entities/canvas-snapshot.entity";
import { CanvasEventRepository } from "./canvas-event.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FindManyOptions, In } from "typeorm";
import { CanvasEventEntity } from "../entities/canvas-event.entity";
import { CanvasEventEnum } from "../types";


describe("CanvasSnapshotRepository", () => {
    let repo: CanvasSnapshotRepository;

    const mockRepo = {
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn()
    }

    const mockService = {
        find: jest.fn()
    }

    beforeEach(async () => {
        const module = await createTestModule({
            providers: [
                CanvasSnapshotRepository,
                {
                    provide: getRepositoryToken(CanvasSnapshotEntity),
                    useValue: mockRepo
                },
                {
                    provide: CanvasEventRepository,
                    useValue: mockService
                }
            ],
        })

        repo = module.get(CanvasSnapshotRepository);
    })

    it("should be defined", () => {
        expect(repo).toBeDefined();
    })

    it("create a snapshot", async () => {
        const snapshot: CanvasSnapshotEntity = {
            id: "1",
            event: null,
            eventId: "UUID",
            state: [],
            created: new Date(),
        }

        mockRepo.save.mockResolvedValue(snapshot);
        const result = await repo.create({ eventId: "1", state: [] });

        expect(mockRepo.save).toHaveBeenCalledWith({ eventId: "1", state: [] });
        expect(result).toEqual(snapshot);
    })

    it("find multiply snapshot", async () => {
        const snapshot: CanvasSnapshotEntity = {
            id: "1",
            event: null,
            eventId: "UUID",
            state: [],
            created: new Date(),
        }

        mockRepo.find.mockResolvedValue([snapshot]);
        const result = await repo.find({ asc: false, ids: ["1", "2"], order: "created" });

        const findOptions: FindManyOptions<CanvasSnapshotEntity> = {
            where: {
                eventId: undefined,
                id: In(["1", "2"]),
                created: undefined,
            },
            order: { created: "desc" },
            take: 10,
            skip: 0
        }
        expect(mockRepo.find).toHaveBeenCalledWith(findOptions);
        expect(result).toEqual([snapshot]);
    })

    it("find snapshot with events", async () => {
        const snapshot: CanvasSnapshotEntity = {
            id: "UUID",
            event: null,
            eventId: "UUID",
            state: [],
            created: new Date(),
        }

        const events: CanvasEventEntity[] = [{
            created: new Date(),
            id: "UUID",
            payload: {id: "UUID"},
            type: CanvasEventEnum.CREATE
        }]

        mockRepo.findOne.mockResolvedValue(snapshot);
        mockService.find.mockResolvedValue(events);
        const result = await repo.findWithEvents("UUID");

        const findOptions: FindManyOptions<CanvasSnapshotEntity> = {
            where: { 
                id: "UUID" 
            }, 
            order: { 
                created: "DESC" 
            }, 
            relations: { event: true }
        }

        expect(mockRepo.findOne).toHaveBeenCalledWith(findOptions);
        expect(result).toBeNull();

        const date = new Date();
        const snapshot2: CanvasSnapshotEntity = {
            ...snapshot,
            created: new Date(),
            event: {
                id: "UUID",
                created: date,
                payload: {id: "UUID"},
                type: CanvasEventEnum.CREATE
            }
        }
        mockRepo.findOne.mockResolvedValue(snapshot2);
        const result2 = await repo.findWithEvents("UUID");
        expect(mockService.find).toHaveBeenCalledWith({ createdFrom: date.getTime(), asc: true, take: 100  });
        expect(result2).toEqual([snapshot2, events]);
    })

    it("find last snapshot", async () => {
        const snapshot: CanvasSnapshotEntity = {
            created: new Date(),
            event: null,
            eventId: "UUID",
            id: "UUID",
            state: []
        }

        mockRepo.find.mockResolvedValue([]);
        const result = await repo.findLast();
        expect(mockRepo.find).toHaveBeenCalledWith({ order: { created: "DESC" }, take: 1 });
        expect(result).toBeNull();

        mockRepo.find.mockResolvedValue([snapshot]);
        const result2 = await repo.findLast();
        expect(result2).toEqual(snapshot);
    })

    it("find snapshot by id", async () => {
        const snapshot: CanvasSnapshotEntity = {
            created: new Date(),
            event: null,
            eventId: "UUID",
            id: "UUID",
            state: []
        }

        mockRepo.findOne.mockResolvedValue(snapshot);
        const result = await repo.findById("UUID");
        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: "UUID" } });
        expect(result).toEqual(snapshot);
    })
})