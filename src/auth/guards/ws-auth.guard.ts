import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Socket } from 'socket.io'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class WsAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private userService: UsersService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client: Socket = context.switchToWs().getClient()
		
		try {
			// Получаем токен из handshake auth или headers
			const token = this.extractToken(client)
			
			if (!token) {
				throw new UnauthorizedException('Токен не найден')
			}

			// Верифицируем токен
			const payload = await this.jwtService.verifyAsync(token)
			
			// Получаем пользователя
			const user = await this.userService.findById(payload.id)
			
			if (!user) {
				throw new UnauthorizedException('Пользователь не найден')
			}

			// Сохраняем пользователя в данных клиента
			client.data.user = user
			
			return true
		} catch (error) {
			throw new UnauthorizedException('Недействительный токен')
		}
	}

	private extractToken(client: Socket): string | undefined {
		// Пытаемся получить токен из handshake auth
		if (client.handshake.auth?.token) {
			return client.handshake.auth.token
		}

		// Пытаемся получить токен из headers
		const authHeader = client.handshake.headers.authorization
		if (authHeader && authHeader.startsWith('Bearer ')) {
			return authHeader.substring(7)
		}

		return undefined
	}
} 