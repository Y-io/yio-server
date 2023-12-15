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
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../common/guards';
import { NotificationWsInterceptor } from '../common/interceptors/notification-ws.interceptor';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventsService: EventsService) {}

  afterInit(server: Server): any {
    // console.log({ server });
  }
  handleConnection(client: Socket, ...args: any[]): any {
    // console.log({ handleConnection: client.handshake, args });
  }
  handleDisconnect(client: Socket): any {
    // console.log({ handleDisconnect: client });
  }

  @UseInterceptors(NotificationWsInterceptor)
  @UseGuards(JwtGuard)
  @SubscribeMessage('notification')
  async handleNotification(data: Notification) {
    return data;
  }

  @UseInterceptors(NotificationWsInterceptor)
  @UseGuards(JwtGuard)
  @SubscribeMessage('message')
  async handleMessage(data: any) {
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
