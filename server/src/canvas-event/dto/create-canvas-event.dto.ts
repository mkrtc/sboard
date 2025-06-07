import { CanvasEventPayload } from "../entities/canvas-event.entity";


export class CreateEventDto{
    readonly type: string;
    readonly payload: CanvasEventPayload[];
}