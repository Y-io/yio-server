import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Server, Socket } from 'socket.io';
import { Notification } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly eventsService: EventsService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server): any {
    // console.log({ server });
  }
  handleConnection(client: Socket, ...args: any[]): any {
    // console.log({ handleConnection: client.handshake, args });
  }
  handleDisconnect(client: Socket): any {
    // console.log({ handleDisconnect: client });
  }

  @SubscribeMessage('notification')
  async handleNotification(data: Notification) {
    return data;
  }

  // 发送通知
  async sendNotification(notification: Notification) {
    this.server.send('notification', notification);
  }

  // 发送消息
  async sendMessage(message: any) {
    this.server.send('message', message);
  }
}
