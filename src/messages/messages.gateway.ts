import { UseGuards } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { WsUser } from 'src/auth/decorators/ws-user.decorator'
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard'
import { JoinChatDto, LeaveChatDto, SendMessageDto } from './dto/ws-message.dto'
import { MessagesService } from './messages.service'

@WebSocketGateway(4200, {
  path: '/socket.io/',
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})
@UseGuards(WsAuthGuard)
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

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
    @WsUser('id') userId: string
  ) {
    try {
      // Создаем сообщение
      const message = await this.messagesService.createMessage(data, userId)
      
      // Отправляем сообщение всем участникам чата
      client.to(data.chatId).emit('new_message', message)
      
      // Отправляем подтверждение отправителю
      return { success: true, message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() data: JoinChatDto,
    @ConnectedSocket() client: Socket,
    @WsUser('id') userId: string
  ) {
    try {
      // Проверяем доступ к чату
      await this.messagesService.getChatMessages(data.chatId, userId)
      
      // Присоединяемся к комнате чата
      client.join(data.chatId)
      
      // Получаем историю сообщений
      const messages = await this.messagesService.getChatMessages(data.chatId, userId)
      
      return { success: true, messages }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @MessageBody() data: LeaveChatDto,
    @ConnectedSocket() client: Socket,
    @WsUser('id') userId: string
  ) {
    try {
      // Проверяем доступ к чату
      await this.messagesService.getChatMessages(data.chatId, userId)
      
      // Покидаем комнату чата
      client.leave(data.chatId)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @SubscribeMessage('get_chat_messages')
  async handleGetChatMessages(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
    @WsUser('id') userId: string
  ) {
    try {
      const messages = await this.messagesService.getChatMessages(data.chatId, userId)
      return { success: true, messages }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @SubscribeMessage('get_my_chats')
  async handleGetMyChats(
    @ConnectedSocket() client: Socket,
    @WsUser('id') userId: string
  ) {
    try {
      const chats = await this.messagesService.getUserChats(userId)
      return { success: true, chats }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
