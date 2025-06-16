import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateMessageDto } from './dto/create-message.dto'

@Injectable()
export class MessagesService {
	constructor(private prisma: PrismaService) {}

	async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
		try { 
			// Проверяем, что пользователь имеет доступ к чату
			await this.checkChatAccess(createMessageDto.chatId, senderId)

			const { chatId, ...messageData } = createMessageDto;
			const message = await this.prisma.messages.create({
				data: {
					...messageData,
					sender: senderId,
					chat: {
						connect: { id: chatId },
					},
					user: {
						connect: { id: senderId },
					},
				},
				include: {
					user: {
						select: {
							id: true,
							email: true,
							username: true
						}
					}
				}
			})

			return message
		} catch (error) {
			throw error;
		}
	}

	async getChatMessages(chatId: string, userId: string) {
		try {
			// Проверяем, что пользователь имеет доступ к чату
			await this.checkChatAccess(chatId, userId)

			const messages = await this.prisma.messages.findMany({
				where: {
					chatId: chatId
				},
				include: {
					user: {
						select: {
							id: true,
							email: true,
							username: true
						}
					}
				},
				orderBy: {
					createdAt: 'asc'
				}
			})

			return messages
		} catch (error) {
			throw error
		}
	}

	async getUserChats(userId: string) {
		try {
			const chats = await this.prisma.chat.findMany({
				where: {
					users: {
						some: {
							id: userId
						}
					}
				},
				include: {
					users: {
						select: {
							id: true,
							email: true,
							username: true
						}
					},
					messages: {
						orderBy: {
							createdAt: 'desc'
						},
						take: 1,
						include: {
							user: {
								select: {
									id: true,
									email: true,
									username: true
								}
							}
						}
					}
				}
			})

			return chats
		} catch (error) {
			throw error
		}
	}

	private async checkChatAccess(chatId: string, userId: string) {
		const chat = await this.prisma.chat.findFirst({
			where: {
				id: chatId,
				users: {
					some: {
						id: userId
					}
				}
			}
		})

		if (!chat) {
			throw new ForbiddenException('У вас нет доступа к этому чату')
		}

		return chat
	}
}
