import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class OtpService {
	public	constructor(private prisma: PrismaService) {}

	async generateOtp(email: string, isSuccess: boolean) {
		const otp = Math.floor(100000 + Math.random() * 900000)
		const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 минут


		 const otpCode = await this.prisma.oTPcode.create({
			data: {
				code: otp,
				isSuccess: isSuccess,
				expiresAt,
				user: {
					connect: {
						email,
					},
				},
			},
		})

		return otpCode.code
	}

	async verifyOtp(otp: number) {
		const otpCode = await this.prisma.oTPcode.findFirst({
			where: {
				code: otp,
			},
			include: {
				user: true,
			},
		})

		if (!otpCode) {
			throw new BadRequestException('Invalid OTP456789')
		}

		if (otpCode.expiresAt < new Date()) {
			await this.prisma.oTPcode.delete({ where: { id: otpCode.id } })
			throw new BadRequestException('OTP expired')
		}

		await this.prisma.oTPcode.delete({
			where: {
				id: otpCode.id,
			},
		})

		return {
			isVerified: true,
			email: otpCode.user?.email,
		}
	}
}
