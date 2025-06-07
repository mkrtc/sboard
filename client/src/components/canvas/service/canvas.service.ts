import { CanvasEventEntity, CanvasEventPayload } from "@/entities";
import { HttpProvider, SocketProvider } from "@/providers";
import { CanvasEventRepository } from "@/repositories";
import { MouseEvent } from "react";



export class CanvasService {
    private readonly _path: string = "/ws/events";
    private readonly canvasEventRepository: CanvasEventRepository;

    private _connected: boolean = false;
    private _canvas: HTMLCanvasElement | null = null;

    private _squares: CanvasEventPayload[] = [];
    public _selectedEvent: CanvasEventEntity | null = null;
    private _selectedSquare: CanvasEventPayload | null = null;
    private _offsetX: number = 0;
    private _offsetY: number = 0;


    constructor() {
        this.canvasEventRepository = new CanvasEventRepository(new HttpProvider, new SocketProvider(this._path));
    }

    public set canvas(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    public get connected(): boolean {
        return this._connected;
    }

    public startup(event: CanvasEventEntity, onNewEvent: (event: CanvasEventEntity) => void) {
        if (!this._canvas) throw new Error("Canvas is not set");
        this._selectedEvent = event;
        this._squares = this._selectedEvent?.payload || [];
        
        this.paint();
        
        this.canvasEventRepository.onNewEvent(event => {
            this.setEvent(event);
            onNewEvent(event);
            this.draw();
        });
    }
    
    public destroy() {
        this.canvasEventRepository.destroy();
    }

    public getEvents(){
        return this.canvasEventRepository.getAll();
    }

    public async getEventById(eventId: string){
        const ev = await this.canvasEventRepository.getEventById(eventId);
        this._selectedEvent = ev;
        this._squares = ev.payload;
        this.draw()
        return ev;
    }

    public addEvent(event: CanvasEventEntity) {
        this._selectedEvent = event;
        this.draw();
    }

    public addSquare() {
        this.canvasEventRepository.addSquare();
    }

    public onMouseDown(event: MouseEvent<HTMLCanvasElement>) {
        const element = this.getElement(event);
        this._selectedSquare = element;
    }

    public onMouseUp(event: MouseEvent<HTMLCanvasElement>) {
        this._selectedSquare = null;
        this.canvasEventRepository.move(this._squares);
    }

    public onMouseMove(event: MouseEvent<HTMLCanvasElement>) {
        if (!this._selectedEvent || !this._selectedSquare) return;
        const [canvas] = this.getCanvasCtx();
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / canvas.clientWidth);
        const y = (event.clientY - rect.top) * (canvas.height / canvas.clientHeight);
        this._selectedSquare.x = x - this._offsetX;
        this._selectedSquare.y = y - this._offsetY;
        this.draw();
    }

    private setEvent(event: CanvasEventEntity) {
        this._selectedEvent = event;
        this._squares = event.payload;
        this.draw();
    }

    private paint() {
        if (!this._selectedEvent) return null;
        const [_, ctx] = this.getCanvasCtx();

        for (const square of this._selectedEvent.payload || []) {
            ctx.fillStyle = square.color;
            ctx.fillRect(square.x, square.y, square.width, square.height);
        }
    }


    private getCanvasCtx(): [HTMLCanvasElement, CanvasRenderingContext2D] {
        if (!this._canvas) throw new Error("Canvas is not set");
        const ctx = this._canvas.getContext("2d");
        if (!ctx) throw new Error("Context is not set");

        return [this._canvas, ctx];
    }

    private getElement(event: MouseEvent<HTMLCanvasElement>): CanvasEventPayload | null {
        if (!this._selectedEvent) return null;
        const [canvas] = this.getCanvasCtx();
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (let i = 0; i < this._selectedEvent?.payload?.length || 0; i++) {
            const element = this._selectedEvent.payload[i];
            if (
                x >= element.x &&
                x <= element.x + element.width &&
                y >= element.y &&
                y <= element.y + element.height
            ) {
                this._offsetX = x - element.x;
                this._offsetY = y - element.y;
                this._squares.splice(i, 1);
                this._squares.push(element);
                this.draw();
                return element;
            }
        }

        return null;
    }

    private draw() {
        const [canvas, ctx] = this.getCanvasCtx();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!this._squares) return;
        for (const element of this._squares) {
            ctx.fillStyle = element.color;
            ctx.fillRect(element.x, element.y, element.width, element.height);
        }
    }

    public clear(){
        this.canvasEventRepository.clear();
    }


}