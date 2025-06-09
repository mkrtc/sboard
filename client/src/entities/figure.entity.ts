import { CanvasEventRepository } from "@/repositories";

export interface IFigureEntity {
    readonly id: string;
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
}

export class FigureEntity implements IFigureEntity{
    readonly id: string;
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;

    private readonly _canvasEventRepository: CanvasEventRepository;

    constructor(figure: IFigureEntity, canvasEventRepository: CanvasEventRepository){
        Object.assign(this, figure);
        this._canvasEventRepository = canvasEventRepository;
    }

    public move(fromEventId?: string){
        this._canvasEventRepository.moveFigure(this.id, this.x, this.y, fromEventId);
    }

    public delete(){
        this._canvasEventRepository.deleteFigure(this.id);
    }

}