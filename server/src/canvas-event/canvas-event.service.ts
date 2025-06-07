import { Injectable } from '@nestjs/common';
import { CanvasEventRepository } from './canvas-event.repository';
import { COLORS } from './consts';
import { v4 as uuidV4 } from 'uuid';
import { CanvasEventPayload } from './entities/canvas-event.entity';

@Injectable()
export class CanvasEventService {


    constructor(
        private readonly eventRepository: CanvasEventRepository
    ){}

    public async addSquare(prevPayload: CanvasEventPayload[]){
        const square = {
            id: uuidV4(),
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            color: this.getRandomColor()
        };
        const data = [square, ...prevPayload];
        
        return await this.eventRepository.create({payload: data, type: "create"});
    }

    public genCleanEvent(){
        return this.eventRepository.create({payload: [], type: "clear"});
    }

    public async updatePayload(payload: CanvasEventPayload[]){
        return await this.eventRepository.create({payload, type: "move"});
    }

    public async getCurrentEvent(){
        return await this.eventRepository.findCurrent();
    }

    public getEventById(id: string){
        return this.eventRepository.findById(id);
    }

    public async getAll(){
        return await this.eventRepository.find();
    }

    private getRandomColor(){
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    }
}
