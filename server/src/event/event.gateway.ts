import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { EventService } from './event.service';
import { Socket } from 'node:net';

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
    console.log(client.emit("message", {hello: "from server"}))
    return 'Hello world!';
  }
}
