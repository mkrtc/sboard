import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CanvasSnapshotEntity } from "../entities/canvas-snapshot.entity";
import { And, FindManyOptions, In, LessThan, MoreThan, Repository } from "typeorm";
import { CreateCanvasSnapshotDto } from "../dto/create-canvas-snapshot.dto";
import { CanvasEventRepository } from "./canvas-event.repository";
import { CanvasEventEntity } from "../entities/canvas-event.entity";
import { FindCanvasSnapshotDto } from "../dto/find-canvas-snapshot.dto";



@Injectable()
export class CanvasSnapshotRepository {

    @InjectRepository(CanvasSnapshotEntity)
    private readonly repository: Repository<CanvasSnapshotEntity>;

    constructor(
        private readonly canvasEventRepository: CanvasEventRepository
    ) { }

    public create(dto: CreateCanvasSnapshotDto): Promise<CanvasSnapshotEntity> {
        return this.repository.save(dto);
    }

    public find(dto: FindCanvasSnapshotDto): Promise<CanvasSnapshotEntity[]> {
        const findOptions: FindManyOptions<CanvasSnapshotEntity> = {
            where: {
                eventId: dto.eventIds ? In(dto.eventIds) : undefined,
                id: dto.ids ? In(dto.ids) : undefined,
                created: dto.createdFrom && dto.createdTo ?
                    And(LessThan(new Date(dto.createdTo)), MoreThan(new Date(dto.createdFrom))) :
                    dto.createdFrom ? MoreThan(new Date(dto.createdFrom)) :
                        dto.createdTo ? LessThan(new Date(dto.createdTo)) : undefined,
            },
            order: { [dto.order || "created"]: dto.asc ? "asc" : "desc" },
            take: dto.take || 10,
            skip: dto.skip || 0
        }
        return this.repository.find(findOptions);
    }

    /**Получить последний снапшот с ивентами */
    public async findWithEvents(snapshotId?: string): Promise<[CanvasSnapshotEntity, CanvasEventEntity[]] | null> {
        const snapshot = await this.repository.findOne({ where: { id: snapshotId }, order: { created: "DESC" }, relations: {event: true} });
        if (!snapshot || !snapshot.event) return null;
        const events = await this.canvasEventRepository.find({ createdFrom: new Date(snapshot.event.created).getTime(), asc: true, take: 100 });

        return [snapshot, events];

    }

    public async findLast(): Promise<CanvasSnapshotEntity | null> {
        const snapshots = await this.repository.find({ order: { created: "DESC" }, take: 1 });
        if (snapshots.length === 0) return null;
        return snapshots[0];
    }

    public findById(id: string): Promise<CanvasSnapshotEntity | null> {
        return this.repository.findOne({ where: { id } });
    }

    public updateState(id: string, state: any): void {
        void this.repository.update(id, { state });
    }

    public delete(id: string): Promise<any> {
        return this.repository.delete(id);
    }

}