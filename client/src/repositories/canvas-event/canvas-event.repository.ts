import { CanvasEventEntity, CanvasEventPayload, ICanvasEventEntity } from "@/entities";
import { HTTP_CONFIG, HttpProvider, SocketProvider } from "@/providers";
import { CANVAS_CLEAR, GET_VERSION, NEW_SQUARE, NEW_VERSION, SQUARE_MOVE } from "./constants";


export class CanvasEventRepository {

    constructor(
        private readonly httpProvider: HttpProvider,
        private readonly socketProvider: SocketProvider
    ) { 
        socketProvider.connect();
    }

    public async getCurrentEvent() {
        const response = await this.httpProvider.get<ICanvasEventEntity>(HTTP_CONFIG.paths.canvasEvent.find);

        if (response.status === "success") return new CanvasEventEntity(response.data);

        throw new Error(response.message);
    }

    public async getAll(){
        const response = await this.httpProvider.get<ICanvasEventEntity[]>(HTTP_CONFIG.paths.canvasEvent.find);

        if (response.status === "success") return response.data.map(entity => new CanvasEventEntity(entity));

        throw new Error(response.message);
    }

    public addSquare() {
        this.socketProvider.emit(NEW_SQUARE, {});
    }

    public async getEventById(id: string) {
        return new Promise<CanvasEventEntity>(res => this.socketProvider.emit<CanvasEventEntity>(GET_VERSION, id, event => res(event)));
    }

    public move(payload: CanvasEventPayload[]) {
        this.socketProvider.emit(SQUARE_MOVE, { payload });
    }

    public onNewEvent(callback: (event: CanvasEventEntity) => void) {
        this.socketProvider.onEvent(NEW_VERSION, (event: CanvasEventEntity) => {
            callback(event);
        });
    }

    public destroy() {
        this.socketProvider.disconnect();
    }

    public clear(){
        return new Promise<CanvasEventEntity>(res => this.socketProvider.emit<CanvasEventEntity>(CANVAS_CLEAR, {}, (event) => res(event)));
    }
}