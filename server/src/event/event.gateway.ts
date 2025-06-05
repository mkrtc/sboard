import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({
  path: '/ws/events',
  cors: {
    origin: '*',
  },
})
export class EventGateway {

  constructor(
    private readonly eventService: EventService
  ){}

  @SubscribeMessage('message')
  public handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('createEvent')
  public createEvent(@ConnectedSocket() client: Socket, @MessageBody() payload: CreateEventDto){
    console.log(payload)
    client.emit("newEvent", payload);
  }
}
