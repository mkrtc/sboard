import { CanvasEventRepository } from "@/repositories";


export type CanvasEventType = "create" | "move" | "clear" | "delete";

export interface EventPayload {
    id: string;
}

export interface MovePayload extends EventPayload {
    x: number;
    y: number;
}

export interface DeletePayload {
    id: string;
}

export interface CreatePayload extends EventPayload {
    color: string;
    target: "square";
}

export type CanvasEventPayload<T extends keyof CanvasEventType | unknown = unknown> =
    T extends "create" ? CreatePayload :
    T extends "move" ? MovePayload :
    T extends "delete" ? DeletePayload :
    T extends "clear" ? null :
    EventPayload;

export interface IEventEntity {
    readonly id: string;
    readonly type: CanvasEventType;
    readonly payload: CanvasEventPayload;
    readonly created: string;
}

export class EventEntity {
    readonly id: string;
    readonly type: CanvasEventType;
    readonly payload: CanvasEventPayload;
    readonly created: Date;
    
    private readonly _canvasEventRepository: CanvasEventRepository;
    
    constructor(event: IEventEntity, canvasEventRepository: CanvasEventRepository) {
        const created = new Date(event.created);
        Object.assign(this, { ...event, created });
        this._canvasEventRepository == canvasEventRepository;
    }

    replay(){
        this._canvasEventRepository.replayEvent(this.id);
    }
}