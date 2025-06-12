import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply } from 'fastify'
import { MailerService } from 'src/mailer/mailer.service'
import { UsersService } from 'src/users/users.service'
import { AuthDto, VerifyOtpDto } from './dto/auth.dto'
import { OtpService } from './otp.service'

@Injectable()
export class AuthService {
	public	constructor(private userService: UsersService, 
		private otpService: OtpService,
		private configService: ConfigService,
		private jwt: JwtService,
		private mailerService: MailerService
	) {}

	private EXPIRE_DAY_REFRESH_TOKEN = 20
 REFRESH_TOKEN_NAME = 'refreshToken'

	async signin(dto: AuthDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user) {
			return this.signup(dto)
		}

		const otp = await this.otpService.generateOtp(dto.email)

		try {
			await this.sendOtp(dto.email, otp)
		} catch (error) {
			throw new BadRequestException(error)
		}

		return {
			message: `OTP sent to ${user.email}`,
		}
	}

	async verifyOtp(dto: VerifyOtpDto) {
		const { email} = await this.otpService.verifyOtp(dto.otp)

		if (!email) {
			throw new BadRequestException('Нет email')
		}

		const user = await this.userService.findByEmail(email)

		if (!user) {
			throw new BadRequestException('User not found')
		}

		if (user.isVerified) {
			const tokens = this.issueTokens(user.id)

			return {
				message: `OTP verified`,
				tokens
			}
		}

	await this.userService.verifyUser(user.id)

	const tokens = this.issueTokens(user.id)

	return {
		message: `OTP verified`,
		tokens
	}
	}

	private async signup(dto: AuthDto) {
		const user = await this.userService.create(dto)
		const otp = await this.otpService.generateOtp(dto.email)

		try {
			await this.sendOtp(dto.email, otp)
		} catch (error) {
			throw new BadRequestException(error)
		}

		return {
			message: `OTP sent to ${user.email}`,
		}
	}

	private async sendOtp(email: string, otp: number) {
		console.log('Sending OTP to', email)

		try {
			await this.mailerService.sendEmail(email, 'Your OTP code', `Your OTP code is ${otp}`)
		} catch (error) {
			console.log('Error sending OTP', error)
			throw new BadRequestException(error)
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { ...user } = await this.userService.findById(result.id)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	private issueTokens(userId: string) {
		const data = { id: userId }
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '20d'
		})

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const tokens = { refreshToken, accessToken }


		return tokens	
	}

	addTokensToResponse(
		rep: FastifyReply,
		refreshToken: string,
	) {
		const expiresInRefresh = new Date()
		expiresInRefresh.setDate(
			expiresInRefresh.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN
		)

		rep.setCookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresInRefresh,
			secure: true,
			sameSite: 'lax',
		});
	}
	removeRefreshTokenFromResponse(rep: FastifyReply) {

		rep.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			sameSite: 'lax'
		})
	}

}