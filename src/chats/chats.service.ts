import { BadRequestException, Injectable } from '@nestjs/common'
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
        include: {
          users: true,
          messages: true
        }
      })

      return chat
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  async createSupportChat(userId?: string) {
    // Получаем всех support-юзеров
    const supportUsers = await this.prisma.user.findMany({
      where: { role: 'SUPPORT' }
    });

    if (!supportUsers.length) {
      throw new BadRequestException('Нет доступных сотрудников поддержки');
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
      },
      include: {
        users: true,
        messages: true
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
          users: true,
          messages: true
        }
      })

      return chats
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
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
      throw new BadRequestException(error)
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
      throw new BadRequestException(error)
    }
  }

  async remove(id: string, userId: string) {
    try{ 
      await this.prisma.chat.delete({
        where: {
          id,
          users: { some: { id: userId } },
        },
      })

      return true
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }
}
