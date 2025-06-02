import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "./entities/event.entity";
import { Repository } from "typeorm";
import { CreateEventDto } from "./dto/create-event.dto";


@Injectable()
export class EventRepository{

    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>;

    public createEvent(event: CreateEventDto): Promise<EventEntity>{
        return this.repository.save(event);
    }

    public findById(id: string): Promise<EventEntity | null>{
        return this.repository.findOne({where: {id}});
    }

    public find(): Promise<EventEntity[]>{
        return this.repository.find();
    }

}