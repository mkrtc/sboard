import { CanvasEventEntity, EventEntity, ICanvasEventEntity, IEventEntity } from "@/entities";
import { HTTP_CONFIG, HttpProvider, SocketProvider } from "@/providers";
import { CLEAR_CANVAS_EVENT, CREATE_FIGURE_EVENT, DELETE_FIGURE_EVENT, EXCEPTION_EVENT, GET_EVENT, GET_LAST_EVENT, MOVE_FIGURE_EVENT, UPDATE_CANVAS_EVENT } from "./constants";
import { CanvasException, GetEventsFilter } from "./canvasEvvent.types";


export class CanvasEventRepository {

    constructor(
        private readonly httpProvider: HttpProvider,
        private readonly socketProvider: SocketProvider
    ) {
        socketProvider.connect();
    }

    public async getEvents(filter?: GetEventsFilter){
        const events = await this.httpProvider.get<IEventEntity[] | null>(HTTP_CONFIG.paths.canvasEvent.find, {query: filter});
        return events?.map((event) => new EventEntity(event, this)) || [];
    }

    public createFigure() {
        this.socketProvider.emit(CREATE_FIGURE_EVENT, {});
    }

    public moveFigure(id: string, x: number, y: number, fromEventId?: string){
        this.socketProvider.emit(MOVE_FIGURE_EVENT, {id, x, y, fromEventId});
    }

    public deleteFigure(id: string){
        this.socketProvider.emit(DELETE_FIGURE_EVENT, {id});
    }

    public clearCanvas(){
        this.socketProvider.emit(CLEAR_CANVAS_EVENT, {});
    }

    public replayEvent(id: string){
        this.socketProvider.emit(GET_EVENT, id);
    }

    public findLastEvent(){
        this.socketProvider.emit(GET_LAST_EVENT, {});
    }

    public onCanvasUpdate(callback: (payload: CanvasEventEntity) => void) {
        this.socketProvider.onEvent(UPDATE_CANVAS_EVENT, (payload: ICanvasEventEntity) => {
            callback(new CanvasEventEntity(payload, this));
        });
    }

    public onError<T>(callback: (error: T) => void) {
        this.socketProvider.onEvent(EXCEPTION_EVENT, callback);
    }

    public socketDisconnect(){
        this.socketProvider.disconnect();
    }


}