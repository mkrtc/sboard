import { CanvasEventEntity } from "./entities/canvas-event.entity";
import { Figure } from "./entities/canvas-snapshot.entity";

export type CanvasEventType = 'create' | 'move' | 'clear' | 'remove';

export enum CanvasEventEnum {
    CREATE = "create",
    MOVE = "move",
    CLEAR = "clear",
    DELETE = "delete"
}

export interface CreateFigurePayload {
  id: string;
  x: number;
  y: number;
  color: string;
  target: "square"; // "square" | "circle" | "triangle"
}

export interface EventPayload{
    id: string;
    fromEventId?: string;
}

export interface MovePayload extends EventPayload{
  x: number;
  y: number;
}

export interface DeletePayload{
    id: string;
}

export interface CreatePayload extends EventPayload{
    color: string;
    target: "square";
}

export type CanvasEventPayload<T extends CanvasEventEnum | unknown = unknown> = 
    T extends CanvasEventEnum.CREATE ? CreatePayload :
    T extends CanvasEventEnum.MOVE ? MovePayload :
    T extends CanvasEventEnum.DELETE ? DeletePayload :
    T extends CanvasEventEnum.CLEAR ? null :
    EventPayload
;

export interface CreateEventData{
    event: CanvasEventEntity;
    canvas: Figure[];
}