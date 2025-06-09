import { CanvasEventEntity, EventEntity, FigureEntity } from "@/entities";
import { HttpProvider, SocketProvider } from "@/providers";
import { CanvasEventRepository, GetEventsFilter } from "@/repositories";
import { MouseEvent } from "react";



export class CanvasService {
    private readonly _path: string = "/ws/events";
    private readonly canvasEventRepository: CanvasEventRepository;

    private _connected: boolean = false;
    private _canvas: HTMLCanvasElement | null = null;

    private _figures: FigureEntity[] = [];
    private _selectedEvent: EventEntity | null = null;
    private _selectedFigure: FigureEntity | null = null;
    private _offsetX: number = 0;
    private _offsetY: number = 0;
    private _replayed: boolean = false;


    constructor() {
        this.canvasEventRepository = new CanvasEventRepository(new HttpProvider, new SocketProvider(this._path));
    }

    public set canvas(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    public get connected(): boolean {
        return this._connected;
    }

    public startup(onNewEvent: (event: CanvasEventEntity) => void) {
        if (!this._canvas) throw new Error("Canvas is not set");
        this.canvasEventRepository.findLastEvent();
        
        this.paint();
        
        this.canvasEventRepository.onCanvasUpdate(event => {
            this._selectedFigure = null;
            this.setEvent(event);
            onNewEvent(event);
            this.draw();
        });
    }
    
    public destroy() {
        this.canvasEventRepository.socketDisconnect();
    }

    public getEvents(filter?: GetEventsFilter){
        return this.canvasEventRepository.getEvents(filter);
    }

    public replyEvent(eventId: string){
        this.canvasEventRepository.replayEvent(eventId);
        this._replayed = true;
    }

    public addEvent(event: CanvasEventEntity) {
        this._selectedEvent = event.event;
        this._figures = event.canvas;
        this.draw();
    }

    public createFigure() {
        this.canvasEventRepository.createFigure();
    }

    public onMouseDown(event: MouseEvent<HTMLCanvasElement>) {
        const element = this.getElement(event);
        this._selectedFigure = element;
    }

    public onMouseUp(event: MouseEvent<HTMLCanvasElement>) {
        if(this._replayed){
            this._selectedFigure?.move(this._selectedEvent?.id);
        }else{
            this._selectedFigure?.move();
        }
        this._replayed = false;
        this._selectedFigure = null;
    }

    public onMouseMove(event: MouseEvent<HTMLCanvasElement>) {
        if (!this._selectedEvent || !this._selectedFigure) return;
        const [canvas] = this.getCanvasCtx();
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / canvas.clientWidth);
        const y = (event.clientY - rect.top) * (canvas.height / canvas.clientHeight);
        this._selectedFigure.x = x - this._offsetX;
        this._selectedFigure.y = y - this._offsetY;
        this.draw();
    }

    private setEvent(event: CanvasEventEntity) {
        this._selectedEvent = event.event;
        this._figures = event.canvas;
        this.draw();
    }

    private paint() {
        if (!this._selectedEvent) return null;
        const [_, ctx] = this.getCanvasCtx();

        for (const figure of this._figures || []) {
            ctx.fillStyle = figure.color;
            ctx.fillRect(figure.x, figure.y, figure.width, figure.height);
        }
    }


    private getCanvasCtx(): [HTMLCanvasElement, CanvasRenderingContext2D] {
        if (!this._canvas) throw new Error("Canvas is not set");
        const ctx = this._canvas.getContext("2d");
        if (!ctx) throw new Error("Context is not set");

        return [this._canvas, ctx];
    }

    private getElement(event: MouseEvent<HTMLCanvasElement>): FigureEntity | null {
        if (!this._selectedEvent) return null;
        const [canvas] = this.getCanvasCtx();
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (let i = this._figures.length - 1; i >= 0; i--) {
            const element = this._figures[i];
            if (
                x >= element.x &&
                x <= element.x + element.width &&
                y >= element.y &&
                y <= element.y + element.height
            ) {
                this._offsetX = x - element.x;
                this._offsetY = y - element.y;
                this._figures.splice(i, 1);
                this._figures.push(element);
                this.draw();
                return element;
            }
        }

        return null;
    }

    private draw() {
        const [canvas, ctx] = this.getCanvasCtx();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!this._figures) return;
        for (const element of this._figures) {
            ctx.fillStyle = element.color;
            ctx.fillRect(element.x, element.y, element.width, element.height);
        }
    }

    public clear(){
        this.canvasEventRepository.clearCanvas();
    }


}