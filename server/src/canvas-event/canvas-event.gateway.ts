import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { CanvasEventService } from './canvas-event.service';
import type { Socket } from 'socket.io';
import { UpdatePayloadDto } from './dto/update-payload.dto';
import { CANVAS_CLEAR, GET_VERSION, NEW_SQUARE, NEW_VERSION, SQUARE_MOVE } from './constants';

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

  @SubscribeMessage(NEW_SQUARE)
  public async addSquare(@ConnectedSocket() client: Socket) {
    const currentEvent = await this.eventService.getCurrentEvent();
    const event = await this.eventService.addSquare(currentEvent?.payload || []);
    client.emit(NEW_VERSION, event);
  }

  @SubscribeMessage(SQUARE_MOVE)
  public async updatePayload(@ConnectedSocket() client: Socket, @MessageBody() payload: [UpdatePayloadDto]) {
    const event = await this.eventService.updatePayload(payload[0].payload);
    client.emit(NEW_VERSION, event);
  }

  @SubscribeMessage(GET_VERSION)
  public async getEvent(@MessageBody() payload: string) {
    const event = await this.eventService.getEventById(payload);
    return event;
  }

  @SubscribeMessage(CANVAS_CLEAR)
  public async clear(@ConnectedSocket() client: Socket) {
    const event = await this.eventService.genCleanEvent();
    client.emit(NEW_VERSION, event);
  }
}
