import { BadRequestException, Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'
import { AuthDto, VerifyOtpDto } from './dto/auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Запросить OTP-код для входа или регистрации' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 200, description: 'OTP отправлен на email', schema: { example: { message: 'OTP sent to test@test.com' } } })
  @ApiResponse({ status: 400, description: 'Ошибка отправки OTP' })
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto)
  }

  @Post('verify-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Подтвердить OTP-код и получить токены' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP подтверждён, возвращаются токены', schema: { example: { message: 'OTP verified', accessToken: '...', tokens: { accessToken: '...', refreshToken: '...' } } } })
  @ApiResponse({ status: 400, description: 'Неверный OTP или нет email' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto, 
    @Res({ passthrough: true }) rep: FastifyReply
  ) {
    const { tokens, message } = await this.authService.verifyOtp(dto)

    if (!tokens) {
      throw new BadRequestException('Нет токенов')
    }

    this.authService.addTokensToResponse(rep, tokens.refreshToken)
    return {
      message: message,
      accessToken: tokens.accessToken
    }
  }

	@Post('new-tokens')
	@ApiOperation({ summary: 'Получить новые токены по refreshToken из cookie' })
	@ApiResponse({ status: 200, description: 'Новые токены выданы', schema: { example: { accessToken: '...' } } })
	@ApiResponse({ status: 401, description: 'Refresh token не передан или невалиден' })
	async getNewTokens(
		@Req() req: FastifyRequest,
    @Res({ passthrough: true }) rep: FastifyReply
	) {
		const refreshTokenFromCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(rep)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, accessToken, ...response } =
			await this.authService.getNewTokens(refreshTokenFromCookies)

		this.authService.addTokensToResponse(rep, refreshToken)

		return {
			accessToken: accessToken
		}
	}

  @HttpCode(200)
	@Post('logout')
	@ApiOperation({ summary: 'Выйти из системы (очистить refreshToken)' })
	@ApiResponse({ status: 200, description: 'Выход выполнен, refreshToken удалён', schema: { example: true } })
	async logout(@Res({ passthrough: true }) rep: FastifyReply) {
		this.authService.removeRefreshTokenFromResponse(rep)
		return true
	}

}
