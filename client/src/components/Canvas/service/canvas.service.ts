import { CanvasEventEntity, EventEntity, FigureEntity } from "@/entities";
import { HttpProvider, SocketProvider } from "@/providers";
import { CanvasEventRepository, GetEventsFilter } from "@/repositories";
import { MouseEvent, UIEvent } from "react";



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
    private _lastScrollTop: number;
    private _isThereMoreEvents: boolean = true;
    private _isLoadingEvents = false;


    constructor() {
        this.canvasEventRepository = new CanvasEventRepository(new HttpProvider, new SocketProvider(this._path));
    }

    public set canvas(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    public get connected(): boolean {
        return this._connected;
    }

    public async startup(onNewEvent: (event: CanvasEventEntity) => void) {
        if (!this._canvas) throw new Error("Canvas is not set");
        this.canvasEventRepository.findLastEvent();
        this.canvasEventRepository.onCanvasUpdate(event => {
            this._selectedFigure = null;
            this.setEvent(event);
            onNewEvent(event);
            this.draw();
        });
    }

    public onError<T extends object>(cb: (error: T) => void) {
        this.canvasEventRepository.onError(cb);
    }

    public async onHistoryScroll(event: UIEvent<HTMLDivElement>, filter?: GetEventsFilter): Promise<EventEntity[]> {
        const target = event.currentTarget;

        const { scrollTop, clientHeight, scrollHeight } = target;
        const isScrollingDown = scrollTop > this._lastScrollTop;

        this._lastScrollTop = scrollTop;
        const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 2;

        console.log(isScrollingDown, isAtBottom)
        console.log("scrollTop: " + scrollTop)
        console.log("clientHeight: " + clientHeight)
        console.log("scrollTop + clientHeight: " + (scrollTop + clientHeight))
        console.log("scrollHeight: " + scrollHeight)
        console.log("-------------------------------")


        if (isScrollingDown && isAtBottom && this._isThereMoreEvents && !this._isLoadingEvents) {
            this._isLoadingEvents = true;

            try {
                const events = await this.getEvents(filter);
                if (!events.length) {
                    this._isThereMoreEvents = false;
                }
                return events;
            } finally {
                this._isLoadingEvents = false;
            }
        }
        return [];
    }

    public destroy() {
        this.canvasEventRepository.socketDisconnect();
    }

    public getEvents(filter?: GetEventsFilter) {
        return this.canvasEventRepository.getEvents(filter);
    }

    public replyEvent(eventId: string) {
        this.canvasEventRepository.replayEvent(eventId);
        this._replayed = true;
    }

    public addEvent(event: CanvasEventEntity) {
        this._selectedEvent = event.event;
        this._figures = event.canvas;
        this.draw();
    }

    public createFigure() {
        if (this._replayed && this._selectedEvent) {
            this.canvasEventRepository.createFigure(this._selectedEvent.id);
            return;
        }
        this.canvasEventRepository.createFigure();
    }

    public selectFigure(event: MouseEvent<HTMLCanvasElement>) {
        const element = this.getElement(event);
        this._selectedFigure = element;
    }

    public saveFigurePosition() {
        if (!this._selectedEvent || !this._selectedFigure) return;
        if (!this._selectedFigure.moved) {
            this._selectedFigure = null;
            return;
        }

        if (this._replayed) {
            this._selectedFigure.move(this._selectedEvent?.id);
        } else {
            this._selectedFigure.move();
        }
        this._replayed = false;
        this._selectedFigure = null;
    }

    public moveFigure(event: MouseEvent<HTMLCanvasElement>) {
        if (!this._selectedEvent || !this._selectedFigure) return;
        const [canvas] = this.getCanvasCtx();
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / canvas.clientWidth);
        const y = (event.clientY - rect.top) * (canvas.height / canvas.clientHeight);
        this._selectedFigure.setPosition(x - this._offsetX, y - this._offsetY);
        this.draw();
    }

    public deleteFigure(event: MouseEvent<HTMLCanvasElement>) {
        const figure = this.getElement(event);
        figure?.delete();
    }

    public clearCanvas() {
        this.canvasEventRepository.clearCanvas();
    }

    private setEvent(event: CanvasEventEntity) {
        this._selectedEvent = event.event;
        this._figures = event.canvas;
        this.draw();
    }

    // Данный метод не самый лучший в плане оптимизации. Каждый раз создать новый массив это дорого, но в данном случае терпимо из-за не высокой нагрузки
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




}