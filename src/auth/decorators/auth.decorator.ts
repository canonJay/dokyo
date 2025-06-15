import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from 'prisma/generated/prisma'
import { JwtAuthGuard } from '../guards/auth.guard'
import { RolesGuard } from '../guards/role.guard'
import { Roles } from './roles.decorator'


/**
 * Декоратор для авторизации пользователей с определенными ролями.
 *
 * Этот декоратор применяет защиту на основе ролей и аутентификации.
 * Если указаны роли, применяется также декоратор Roles.
 *
 * @param roles - Массив ролей, для которых требуется доступ.
 * @returns Декораторы, применяемые к методу или классу.
 */
export function Authorization(...roles: Role[]) {
	if (roles.length > 0) {
		return applyDecorators(
			Roles(...roles),
			UseGuards(JwtAuthGuard, RolesGuard)
		)
	}

	return applyDecorators(UseGuards(JwtAuthGuard))
}