import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateEventDto } from "./dto/create-canvas-event.dto";
import { CanvasEventEntity } from "./entities/canvas-event.entity";


@Injectable()
export class CanvasEventRepository{

    @InjectRepository(CanvasEventEntity)
    private readonly repository: Repository<CanvasEventEntity>;

    public create(event: CreateEventDto): Promise<CanvasEventEntity>{
        return this.repository.save(event);
    }

    public findById(id: string): Promise<CanvasEventEntity | null>{
        return this.repository.findOne({where: {id}});
    }

    public find(): Promise<CanvasEventEntity[]>{
        return this.repository.find({order: {created: "desc"}});
    }

    public update(event: CanvasEventEntity): Promise<CanvasEventEntity>{
        return this.repository.save(event);
    }

    public async findCurrent(): Promise<CanvasEventEntity | null>{
        const event = await this.repository.find({order: {created: "DESC"}, take: 1});
        return event[0] || null;
    }

}