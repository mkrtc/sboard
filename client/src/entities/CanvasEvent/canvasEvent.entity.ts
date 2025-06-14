import { SocketProvider } from "@/providers";
import { EventEntity, IEventEntity } from "../Event/event.entity";
import { FigureEntity, IFigureEntity } from "../Figure/figure.entity";
import { CanvasEventRepository } from "@/repositories";


export interface ICanvasEventEntity{
    event: IEventEntity | null;
    canvas: IFigureEntity[];
}

export class CanvasEventEntity {
    event: EventEntity | null;
    canvas: FigureEntity[];

    constructor(event: ICanvasEventEntity, canvasEventRepository: CanvasEventRepository){
        this.event = event.event ? new EventEntity(event.event, canvasEventRepository) : null;
        this.canvas = event.canvas.map((figure) => new FigureEntity(figure, canvasEventRepository));
    }
}