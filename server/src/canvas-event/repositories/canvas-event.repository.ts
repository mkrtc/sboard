import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { And, FindManyOptions, LessThan, MoreThan, Repository } from "typeorm";
import { CanvasEventEntity } from "../entities/canvas-event.entity";
import { FindCanvasEventDto } from "../dto/find-canvas-event.dto";
import { CanvasEventEnum, CanvasEventPayload } from "../types";


@Injectable()
export class CanvasEventRepository{

    @InjectRepository(CanvasEventEntity)
    private readonly repository: Repository<CanvasEventEntity>;

    public create(type: CanvasEventEnum, payload?: CanvasEventPayload): Promise<CanvasEventEntity>{
        return this.repository.save({type, payload: payload || {}});
    }

    public find(dto: FindCanvasEventDto): Promise<CanvasEventEntity[]>{
        const findOptions: FindManyOptions<CanvasEventEntity> = {
            order: {[dto.order || "created"]: dto.asc ? "asc" : "desc"},
            take: dto.take || 10,
            skip: dto.skip || 0,
            where: {
                type: dto.type,
                created: dto.createdFrom && dto.createdTo ? 
                    And(LessThan(new Date(dto.createdTo)), MoreThan(new Date(dto.createdFrom))) : 
                    dto.createdFrom ? MoreThan(new Date(dto.createdFrom)) : 
                    dto.createdTo ? LessThan(new Date(dto.createdTo)) : undefined,
            }
        }
        return this.repository.find(findOptions);
    }

    public findById(id: string): Promise<CanvasEventEntity | null>{
        return this.repository.findOne({where: {id}});
    }

    public async findLast(): Promise<CanvasEventEntity | null>{
        const events = await this.repository.find({order: {created: "DESC"}, take: 1});
        return events[0];
    }

    public async remove(id: string): Promise<void> {
        void await this.repository.delete({id});
    }

}