import {
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'


/**
 * JWT Guard для проверки аутентификации пользователя через Bearer токены.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	/**
	 * Переопределяем метод canActivate для кастомной обработки ошибок.
	 * @param context - Контекст выполнения, содержащий информацию о текущем запросе.
	 * @returns true, если пользователь аутентифицирован; в противном случае выбрасывает UnauthorizedException.
	 * @throws UnauthorizedException - Если пользователь не авторизован.
	 */
	canActivate(context: ExecutionContext) {
		return super.canActivate(context)
	}

	/**
	 * Обрабатывает ошибки аутентификации.
	 * @param err - Ошибка аутентификации.
	 * @param user - Пользователь из JWT токена.
	 * @param info - Дополнительная информация об ошибке.
	 * @throws UnauthorizedException - Если пользователь не авторизован.
	 */
	handleRequest(err: any, user: any, info: any) {
		if (err || !user) {
			throw new UnauthorizedException(
				'Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.'
			)
		}
		return user
	}
}