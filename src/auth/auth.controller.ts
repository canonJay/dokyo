import { BadRequestException, Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'
import { AuthDto, VerifyOtpDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'Отправлен код на email' })
  @ApiBody({ type: AuthDto })
  @Post('signin')
  @HttpCode(200)
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto)
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 200, description: 'Токены' })
  @ApiResponse({ status: 401, description: 'Неверный OTP' })
  @ApiBody({ type: VerifyOtpDto })
  @Post('verify-otp')
  @HttpCode(200)
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

  @ApiCookieAuth('refreshToken')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get new tokens', description: 'Требуется передать refreshToken в cookies' })
  @ApiResponse({ status: 200, description: 'New tokens' })
  @ApiResponse({ status: 400, description: 'Refresh token not passed' })
  @ApiResponse({ status: 401, description: 'Refresh token not passed' })
	@Post('new-tokens')
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

  @ApiCookieAuth('refreshToken')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout' })
	@Post('logout')
	async logout(@Res({ passthrough: true }) rep: FastifyReply) {
		this.authService.removeRefreshTokenFromResponse(rep)
		return true
	}

}
