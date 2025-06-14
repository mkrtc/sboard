import { CanvasEventRepository } from "@/repositories";

export interface IFigureEntity {
    readonly id: string;
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
}

export class FigureEntity{
    public readonly id: string;
    public readonly color: string;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    
    private _moved: boolean;
    
    private readonly _canvasEventRepository: CanvasEventRepository;

    constructor(figure: IFigureEntity, canvasEventRepository: CanvasEventRepository){
        this.setPosition(figure.x, figure.y);
        this.id = figure.id;
        this.color = figure.color;
        this._width = figure.width;
        this._height = figure.height;
        
        this._canvasEventRepository = canvasEventRepository;
        this._moved = false;
    }

    public get x(){
        return this._x;
    }

    public get y(){
        return this._y;
    }

    public get width(){
        return this._width;
    }

    public get height(){
        return this._height;
    }

    public get moved(){
        return this._moved;
    }

    public setPosition(x: number, y: number){
        if(x === this._x && y === this._y){
            this._moved = false;
            return;
        }
        this._moved = true;
        this._x = x;
        this._y = y;
    }

    /**Api method */
    public move(fromEventId?: string){
        this._canvasEventRepository.moveFigure(this.id, this._x, this._y, fromEventId);
    }

    /** Api method */
    public delete(){
        this._canvasEventRepository.deleteFigure(this.id);
    }

}