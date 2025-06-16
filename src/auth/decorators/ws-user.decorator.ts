import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Socket } from 'socket.io'

/**
 * Декоратор для получения авторизованного пользователя из WebSocket соединения.
 * 
 * @param data - Имя свойства пользователя, которое нужно извлечь
 * @param ctx - Контекст выполнения WebSocket
 * @returns Значение свойства пользователя или весь объект пользователя
 */
export const WsUser = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const client: Socket = ctx.switchToWs().getClient()
		const user = client.data.user

		if (!user) {
			throw new UnauthorizedException('Пользователь не авторизован')
		}

		return data ? user[data] : user
	}
) 