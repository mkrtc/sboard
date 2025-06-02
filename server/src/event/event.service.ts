import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {


    constructor(
        private readonly eventRepository: EventRepository
    ){}

}
