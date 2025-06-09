import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { CanvasEventService } from './canvas-event.service';
import type { Socket } from 'socket.io';
import { CLEAR_CANVAS_EVENT, CREATE_FIGURE_EVENT, GET_EVENT, MOVE_FIGURE_EVENT, DELETE_FIGURE_EVENT, UPDATE_CANVAS_EVENT, GET_LAST_EVENT } from './constants';
import { MoveFigureDto } from './dto/move-figure.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { CanvasEventEnum } from './types';

@WebSocketGateway({
  path: '/ws/events',
  cors: {
    origin: '*',
  },
})
export class CanvasEventGateway {

  constructor(
    private readonly eventService: CanvasEventService
  ) { }

  @SubscribeMessage(MOVE_FIGURE_EVENT)
  public async moveFigure(@ConnectedSocket() client: Socket, @MessageBody() dto: MoveFigureDto){
    const state = await this.eventService.createEvent(CanvasEventEnum.MOVE, dto);
    client.emit(UPDATE_CANVAS_EVENT, state);
  }
  
  @SubscribeMessage(CREATE_FIGURE_EVENT)
  public async createFigure(@ConnectedSocket() client: Socket){
    const state = await this.eventService.createEvent(CanvasEventEnum.CREATE);
    client.emit(UPDATE_CANVAS_EVENT, state);
  }

  @SubscribeMessage(DELETE_FIGURE_EVENT)
  public async removeFigure(@ConnectedSocket() client: Socket, @MessageBody(new ParseUUIDPipe({version: "4"})) id: string){
    const state = await this.eventService.createEvent(CanvasEventEnum.DELETE, {id});
    client.emit(UPDATE_CANVAS_EVENT, state);
  }

  @SubscribeMessage(CLEAR_CANVAS_EVENT)
  public async clear(@ConnectedSocket() client: Socket){
    const state = await this.eventService.createEvent(CanvasEventEnum.CLEAR);
    client.emit(UPDATE_CANVAS_EVENT, state);
  }

  @SubscribeMessage(GET_EVENT)
  public async getEvent(@ConnectedSocket() client: Socket, @MessageBody(new ParseUUIDPipe({version: "4"})) id: string){
    const state = await this.eventService.replayByEventId(id);
    client.emit(UPDATE_CANVAS_EVENT, state);
  }

  @SubscribeMessage(GET_LAST_EVENT)
  public async getLastEvent(@ConnectedSocket() client: Socket){
    const state = await this.eventService.findLastEvent();
    client.emit(UPDATE_CANVAS_EVENT, state);
  }
}
