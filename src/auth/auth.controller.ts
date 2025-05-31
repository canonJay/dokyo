import { BadRequestException, Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'
import { AuthDto, VerifyOtpDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto)
  }

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

  @HttpCode(200)
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

  @HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) rep: FastifyReply) {
		this.authService.removeRefreshTokenFromResponse(rep)
		return true
	}

}
