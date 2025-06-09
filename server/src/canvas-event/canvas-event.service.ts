import { Injectable } from '@nestjs/common';
import { CanvasEventRepository } from './repositories/canvas-event.repository';
import { CanvasSnapshotRepository } from './repositories/canvas-snapshot.repository';
import { v4 as uuidV4 } from 'uuid';
import { CanvasEventEntity } from './entities/canvas-event.entity';
import { CanvasSnapshotEntity, Figure } from './entities/canvas-snapshot.entity';
import { COLORS } from './constants';
import { FindCanvasSnapshotDto } from './dto/find-canvas-snapshot.dto';
import { FindCanvasEventDto } from './dto/find-canvas-event.dto';
import { WsException } from '@nestjs/websockets';
import { MoveFigureDto } from './dto/move-figure.dto';
import { CanvasEventEnum, CanvasEventPayload, CreatePayload, EventPayload } from './types';
import { CreateFigureDto } from './dto/create-figure.dto';

@Injectable()
export class CanvasEventService {


    constructor(
        private readonly canvasEventRepository: CanvasEventRepository,
        private readonly canvasSnapshotRepository: CanvasSnapshotRepository
    ) { }

    public async createSnapshot(eventId: string, state: Figure[]): Promise<CanvasSnapshotEntity> {
        const data = await this.canvasSnapshotRepository.findWithEvents();
        if (!data) {
            return await this.canvasSnapshotRepository.create({ state, eventId });
        }
        const [snapshot, events] = data;
        if (events.length >= 10) {
            return await this.canvasSnapshotRepository.create({ state, eventId: events[9].id });
        }

        return snapshot;
    }

    public async createSnapshotFromEventId(eventId: string, type: CanvasEventEnum, payload?: CanvasEventPayload) {
        const baseEvent = await this.canvasEventRepository.findById(eventId);
        if (!baseEvent) throw new WsException("Event not found");
        const [snapshot] = await this.canvasSnapshotRepository.find({
            createdTo: baseEvent.created.getTime(),
            take: 1
        });
        const restored = await this.replaySnapshot(snapshot.id, eventId);
        const event = await this.canvasEventRepository.create(type, payload);
        await this.canvasSnapshotRepository.create({
            state: restored.canvas,
            eventId: event.id
        });

        return event;
    }

    public async replaySnapshot(snapshotId: string, toEventId?: string) {
        const data = await this.canvasSnapshotRepository.findWithEvents(snapshotId);
        if (!data) throw new WsException("Snapshot not found");
        const [snapshot, events] = data;
        const state: Figure[] = snapshot.state;
        for (const event of events) {
            const payload = event.payload;
            const type = event.type;

            switch (type) {
                case CanvasEventEnum.CREATE: {
                    const { id, target, color } = payload as CanvasEventPayload<CanvasEventEnum.CREATE>;
                    const figure = this.createFigure(id, target, color);
                    state.push(figure); break;
                }
                case CanvasEventEnum.MOVE: {
                    const { x, y, id } = payload as CanvasEventPayload<CanvasEventEnum.MOVE>;
                    const index = state.findIndex(f => f.id === id);
                    if (index === -1) continue;

                    const figure = state[index];
                    figure.x = x;
                    figure.y = y;
                    state.splice(index, 1);
                    state.push(figure); break;
                }
                case CanvasEventEnum.CLEAR: {
                    state.length = 0; break;
                }
                case CanvasEventEnum.DELETE: {
                    const { id } = payload;
                    const index = state.findIndex(f => f.id === id);
                    if (index === -1) continue;
                    state.splice(index, 1);
                }
            }

            if (event.id === toEventId) return { event, canvas: state };
        }
        return { event: events[events.length - 1], canvas: state };
    }

    public async replayByEventId(eventId: string) {
        const event = await this.canvasEventRepository.findById(eventId);
        if (!event) throw new WsException("Event not found");
        const [snapshot] = await this.canvasSnapshotRepository.find({ createdTo: event.created.getTime(), take: 1 });
        if (!snapshot) throw new WsException("Snapshot not found");
        return this.replaySnapshot(snapshot.id, event.id);
    }

    public createEvent(type: CanvasEventEnum.CLEAR): Promise<{ event: CanvasEventEntity, canvas: Figure[] }>;
    public createEvent(type: CanvasEventEnum.CREATE, payload?: CreateFigureDto): Promise<{ event: CanvasEventEntity, canvas: Figure[] }>;
    public createEvent(type: CanvasEventEnum.MOVE, payload: MoveFigureDto): Promise<{ event: CanvasEventEntity, canvas: Figure[] }>;
    public createEvent(type: CanvasEventEnum.DELETE, payload: EventPayload): Promise<{ event: CanvasEventEntity, canvas: Figure[] }>;
    public async createEvent(type: CanvasEventEnum, payload?: CanvasEventPayload | CreateFigureDto): Promise<{ event: CanvasEventEntity, canvas: Figure[] }> {
        let event: CanvasEventEntity;

        switch (type) {
            case CanvasEventEnum.CREATE: {
                const payloadData = payload as CreateFigureDto;
                const data: CreatePayload = {
                    color: this.getRandomColor(),
                    id: uuidV4(),
                    target: "square"
                }
                if(payloadData?.fromEventId){
                    event = await this.createSnapshotFromEventId(payloadData.fromEventId, type, data); break;
                }
                event = await this.canvasEventRepository.create(type, data);
                break;
            }
            case CanvasEventEnum.MOVE: {
                const payloadData = payload as MoveFigureDto;
                if (payloadData.fromEventId) {
                    event = await this.createSnapshotFromEventId(payloadData.fromEventId, type, payloadData); break;
                }

                event = await this.canvasEventRepository.create(type, payloadData); break;

            }
            case CanvasEventEnum.CLEAR: {
                event = await this.canvasEventRepository.create(type);
                break;
            }
            case CanvasEventEnum.DELETE: {
                event = await this.canvasEventRepository.create(type, payload as EventPayload);
                break;
            }
        }
        const lastSnapshot = await this.canvasSnapshotRepository.findLast();
        const lastState = lastSnapshot ? await this.replaySnapshot(lastSnapshot.id) : { canvas: [] };
        const snapshot = await this.createSnapshot(event.id, lastState.canvas);

        return await this.replaySnapshot(snapshot.id);
    }

    public async findLastEvent() {
        const event = await this.canvasEventRepository.findLast();
        const snapshot = await this.canvasSnapshotRepository.findLast();
        if (!snapshot) return { event, canvas: [] };
        return await this.replaySnapshot(snapshot.id);
    }

    public findSnapshots(dto: FindCanvasSnapshotDto) {
        return this.canvasSnapshotRepository.find(dto);
    }

    public findSnapshotWithEvents() {
        return this.canvasSnapshotRepository.findWithEvents();
    }

    public findEvents(dto: FindCanvasEventDto) {
        return this.canvasEventRepository.find(dto);
    }


    private createFigure(id: string, type: string, color?: string): Figure {
        switch (type) {
            case "square": return this.createSquare(id, color);

            // Здесь в зависимости от типа можно создавать разные фигуры
            // case "circle": return this.createCircle(color);
            // etc ...

            default: return this.createSquare(id, color);
        }
    }

    private createSquare(id: string, color?: string) {
        return {
            id,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            color: color || this.getRandomColor()
        }
    }

    private getRandomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    }
}
