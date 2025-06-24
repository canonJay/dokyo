import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateChatDto } from './dto/create-chat.dto'

@Injectable()
export class ChatsService {

  constructor(private prisma: PrismaService) {}
  async create(createChatDto: CreateChatDto) {
    try{ 
      const chat = await this.prisma.chat.create({
        data: {
          users: {
            connect: createChatDto.users.map((user) => ({ id: user })),
          },
        },
      })

      return chat
    } catch (error) {
      console.log(error)
      throw new Error('Failed to create chat')
    }
  }

  async createSupportChat(userId: string) {
    // Получаем всех support-юзеров
    const supportUsers = await this.prisma.user.findMany({
      where: { role: 'SUPPORT' }
    });

    if (!supportUsers.length) {
      throw new Error('Нет доступных сотрудников поддержки');
    }

    // Выбираем случайного support-юзера
    const randomSupport = supportUsers[Math.floor(Math.random() * supportUsers.length)];

    // Создаём чат между пользователем и support-юзером
    const chat = await this.prisma.chat.create({
      data: {
        users: {
          connect: [
            { id: userId },
            { id: randomSupport.id }
          ]
        }
      }
    });

    return chat;
  }

  async findMyChats(userId: string) {
    try{ 
      const chats = await this.prisma.chat.findMany({
        where: {
          users: { some: { id: userId } },
        },
        include: {
          users: true
        }
      })

      return chats
    } catch (error) {
      console.log(error)
      throw new Error('Failed to find chats')
    }
  }

  async getMyChatByUserId(userId: string, authUserId: string) {
    try {
      const chat = await this.prisma.chat.findFirst({
        where: {
          AND: [
            { users: { some: { id: userId } } },
            { users: { some: { id: authUserId } } },
          ],
        },
      });
      return chat;
    } catch (error) {
      // обработка ошибки
    }
  }

  async findOne(id: string, userId: string) {
    try{ 
      const chat = await this.prisma.chat.findUnique({
        where: {
          id,
          users: { some: { id: userId } },
        },
        include: {
          users: true,
          messages: true,
        },
      })

      return chat
    } catch (error) {
      console.log(error)
      throw new Error('Failed to find chat')
    }
  }

  async remove(id: string, userId: string) {
    try{ 
      const chat = await this.prisma.chat.delete({
        where: {
          id,
          users: { some: { id: userId } },
        },
      })

      return true
    } catch (error) {
      console.log(error)
      throw new Error('Failed to remove chat')
    }
  }
}
