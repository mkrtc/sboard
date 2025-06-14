import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CanvasEventService } from './canvas-event.service';
import type { Server, Socket } from 'socket.io';
import { CLEAR_CANVAS_EVENT, CREATE_FIGURE_EVENT, GET_EVENT, MOVE_FIGURE_EVENT, DELETE_FIGURE_EVENT, UPDATE_CANVAS_EVENT, GET_LAST_EVENT } from './constants';
import { MoveFigureDto } from './dto/move-figure.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { CanvasEventEnum, CanvasEventPayload, CreateEventData } from './types';
import { validateDto } from 'src/common/utils/validate-dto';
import { DeleteFigureDto } from './dto/delete-figure.dto';
import { CreateFigureDto } from './dto/create-figure.dto';

@WebSocketGateway({
  path: '/ws/events',
  cors: {
    origin: '*',
  },
})
export class CanvasEventGateway {
  // Чтобы уведомить сразу всех о новых событиях.
  // Если добавить авторизацию — можно будет сделать через комнаты для пользователей.
  // Сейчас просто общий холст, все получают ивенты.
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly eventService: CanvasEventService
  ) { }

  @SubscribeMessage(MOVE_FIGURE_EVENT)
  public async moveFigure(@MessageBody() body: any) {
    const dto = await validateDto(MoveFigureDto, body);
    await this.handleCanvasEvent(CanvasEventEnum.MOVE, dto);
  }

  @SubscribeMessage(CREATE_FIGURE_EVENT)
  public async createFigure(@MessageBody() body: any) {
    const dto = await validateDto(CreateFigureDto, body);
    await this.handleCanvasEvent(CanvasEventEnum.CREATE, dto);
  }

  @SubscribeMessage(DELETE_FIGURE_EVENT)
  public async removeFigure(@MessageBody() body: any) {
    const dto = await validateDto(DeleteFigureDto, body);
    await this.handleCanvasEvent(CanvasEventEnum.DELETE, dto);
  }

  @SubscribeMessage(CLEAR_CANVAS_EVENT)
  public async clear() {
    await this.handleCanvasEvent(CanvasEventEnum.CLEAR)
  }

  // Если человек откатился и хочет посмотреть старые события, то уведомление получит только он.
  @SubscribeMessage(GET_EVENT)
  public async getEvent(@ConnectedSocket() client: Socket, @MessageBody(new ParseUUIDPipe({ version: "4" })) id: string) {
    const state: CreateEventData = await this.eventService.replayByEventId(id);
    client.emit(UPDATE_CANVAS_EVENT, state);
  }

  @SubscribeMessage(GET_LAST_EVENT)
  public async getLastEvent() {
    const state: CreateEventData | {event: null, canvas: []} = await this.eventService.findLastEvent();
    this.server.emit(UPDATE_CANVAS_EVENT, state);
  }

  private async handleCanvasEvent(type: CanvasEventEnum, payload?: CanvasEventPayload | CreateFigureDto | null) {
    const state: CreateEventData = await this.eventService.createEvent(type, payload);
    this.server.emit(UPDATE_CANVAS_EVENT, state);
  }
}
