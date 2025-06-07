export interface CanvasEventPayload {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

export interface ICanvasEventEntity {
    id: string;
    type: string;
    data: CanvasEventPayload[];
    created: string;
}


export class CanvasEventEntity {
    public id: string;
    public type: string;
    public payload: CanvasEventPayload[];
    public created: Date;

    constructor(event: ICanvasEventEntity) {
        const created = new Date(event.created);
        Object.assign(this, { ...event, created });
    }
}