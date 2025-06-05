import { EventEntity, SquareEntity } from "@/entities";
import { SocketModule } from "@/shared";
import { MouseEvent } from "react";



export class CanvasService {
    private readonly _path: string = "/ws/events";
    private _connected: boolean = false;
    private _canvas: HTMLCanvasElement | null = null;
    public _events: EventEntity[] = [];
    private _squares: SquareEntity[] = [];
    public _selectedEvent: EventEntity | null = null;
    private _selectedSquare: SquareEntity | null = null;
    private _offsetX: number = 0;
    private _offsetY: number = 0;

    private readonly socketModule: SocketModule;

    constructor() {
        this.socketModule = new SocketModule(this._path);
    }

    public set canvas(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    public get connected(): boolean {
        return this._connected;
    }

    public addEvents(events: EventEntity[]) {
        this._events = events;
        this._selectedEvent = events[0];
        this.draw();
    }

    public addElement() {
        EventEntity.createRandomSquare(this.socketModule, this._selectedEvent);
    }

    public startup() {
        if (!this._canvas) throw new Error("Canvas is not set");
        this.paint();
        this.socketModule.connect();
        this.socketModule.onEvent("newEvent", (event: EventEntity) => {
            // this.addEvents(events);
            this._events.push(event);
            this._selectedEvent = event;
            this._squares = event.data;
            this.draw();
        });
    }

    public destroy() {
        this.socketModule.disconnect();
    }

    public paint() {
        if (!this._selectedEvent) return null;
        const [_, ctx] = this.getCanvasCtx();

        for (const square of this._selectedEvent.data || []) {
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

    private getElement(event: MouseEvent<HTMLCanvasElement>): SquareEntity | null {
        if (!this._selectedEvent) return null;
        const [canvas] = this.getCanvasCtx();
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (const element of this._selectedEvent.data || []) {
            if (
                x >= element.x &&
                x <= element.x + element.width &&
                y >= element.y &&
                y <= element.y + element.height
            ) {
                this._offsetX = x - element.x;
                this._offsetY = y - element.y;

                this._squares.filter(el => el.id !== element.id);
                this._squares.push(element);
                this.draw();
                return element;
            }
        }

        return null;
    }

    public onMouseDown(event: MouseEvent<HTMLCanvasElement>) {
        const element = this.getElement(event);
        this._selectedSquare = element;
    }

    public onMouseUp(event: MouseEvent<HTMLCanvasElement>) {
        this._selectedSquare = null;
    }

    public onMouseMove(event: MouseEvent<HTMLCanvasElement>) {
        if (!this._selectedEvent || !this._selectedSquare) return;
        const [canvas, ctx] = this.getCanvasCtx();
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / canvas.clientWidth);
        const y = (event.clientY - rect.top) * (canvas.height / canvas.clientHeight);
        this._selectedSquare.x = x - this._offsetX;
        this._selectedSquare.y = y - this._offsetY;
        this.updateCanvas();
    }

    public updateCanvas() {
        if (!this._selectedEvent) return;

        const event = this._events.find(e => e.id === this._selectedEvent!.id);
        const element = this._selectedSquare;
        if (!event || !element) return;

        const index = this._events.findIndex(e => e.id === event.id);
        if (index === -1) return;
        this._events[index] = event;
        this.draw();
    }

    public draw() {
        const [canvas, ctx] = this.getCanvasCtx();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!this._squares) return;
        for (const element of this._squares) {
            ctx.fillStyle = element.color;
            ctx.fillRect(element.x, element.y, element.width, element.height);
        }
    }

    public connect(): void {
        this._connected = this.socketModule.connect();
    }

    public disconnect(): void {
        this._connected = this.socketModule.disconnect();
    }

    public onConnect() {
        this.socketModule.onConnect(() => {
            console.log("Connected to server");
        })
    }

    public emit() {
        this.socketModule.emit("message", { hello: "world2" }, value => {
            console.log("emit", value);
        });
    }

    public send() {
        this.socketModule.send("message", { hello: "world" }, value => {
            console.log("send", value);
        });
    }

    public onMessage() {
        this.socketModule.onEvent("message", (data: any) => {
            console.log(data);
        })
    }


}