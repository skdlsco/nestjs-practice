import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse, ConnectedSocket } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io';

@WebSocketGateway(4000, { cors: { origin: 'http://localhost:3000', credentials: true }, namespace: 'socket'})
export class SocketGateway {

  @WebSocketServer()
  server: Server;

  player = [{ pos: {x: 0, y: 0}}, { pos: {x: 0, y: 0}}];

  @SubscribeMessage('move')
  sendMessage(@MessageBody() data: any[], @ConnectedSocket() client: Socket): WsResponse<any> {
    console.log(client.id);
    console.log(data);
    this.player[parseInt(data[0])] = data[1];
    client.broadcast.emit('update', {data: this.player});
    return {event: 'update', data: { data: this.player }}
  }
}