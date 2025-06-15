import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { MessagesService } from './messages.service'

@WebSocketGateway( 4201, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log("Client connected:", client.id)
    return client.id
  }

  handleDisconnect(client: Socket) {
    console.log("Client disconnected:", client.id)

    return client.id
  }
}
