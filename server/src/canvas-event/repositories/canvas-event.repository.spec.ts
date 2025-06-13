import { createTestModule } from "test/utils/create-test-module";
import { CanvasEventRepository } from "./canvas-event.repository";
import { CanvasEventEntity } from "../entities/canvas-event.entity";
import { CanvasEventEnum } from "../types";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FindManyOptions } from "typeorm";


describe("CanvasEventRepository", () => {
    let repo: CanvasEventRepository;

    const mockRepo = {
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn()
    }

    beforeEach(async () => {
        const module = await createTestModule({
            providers: [
                CanvasEventRepository,
                {
                    provide: getRepositoryToken(CanvasEventEntity),
                    useValue: mockRepo
                }
            ]
        })
        repo = module.get(CanvasEventRepository);
    });

    it("should be defined", () => {
        expect(repo).toBeDefined();
    })

    it("save canvas event", async () => {
        const event: CanvasEventEntity = {
            id: "1",
            type: CanvasEventEnum.CREATE,
            created: new Date(),
            payload: { id: "1" }
        }
        mockRepo.save.mockResolvedValue(event);
        const result = await repo.create(CanvasEventEnum.CREATE, { id: "1" });
        expect(result).toEqual(event);
    })

    it("find multiply canvas event", async () => {
        const event: CanvasEventEntity = {
            id: "1",
            type: CanvasEventEnum.CREATE,
            created: new Date(),
            payload: { id: "1" }
        }
        mockRepo.find.mockResolvedValue([event]);
        const result = await repo.find({ asc: false, order: "created" });

        const findOptions: FindManyOptions<CanvasEventEntity> = {
            order: { created: "desc" },
            take: 10,
            skip: 0,
            where: {
                type: undefined,
                created: undefined,
            }
        }

        expect(mockRepo.find).toHaveBeenCalledWith(findOptions)
        expect(result).toEqual([event]);
    })

    it("find one canvas event", async () => {
        const event: CanvasEventEntity = {
            id: "1",
            type: CanvasEventEnum.CREATE,
            created: new Date(),
            payload: { id: "1" }
        }
        mockRepo.findOne.mockResolvedValue(event);
        const result = await repo.findById("1");
        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
        expect(result).toEqual(event);
    })

    it("find last event", async () => {
        const event: CanvasEventEntity = {
            id: "1",
            type: CanvasEventEnum.CREATE,
            created: new Date(),
            payload: { id: "1" }
        }
        mockRepo.find.mockResolvedValue([event]);
        const result = await repo.findLast();
        expect(mockRepo.find).toHaveBeenCalledWith({ order: { created: "DESC" }, take: 1 });
        expect(result).toEqual(event);
    })
})