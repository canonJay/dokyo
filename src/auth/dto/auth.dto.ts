import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator'

export class AuthDto {
	@ApiProperty({
		description: 'The email of the user',
		example: 'test@test.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty({
		description: 'The isSuccess of the user',
		example: true,
	})
	@IsBoolean()
	@IsOptional()
	isSuccess: boolean
}

export class VerifyOtpDto {
	@ApiProperty({
		description: 'The OTP code',
		example: 123456,
	})
	@IsNumber()
	@Min(100000)
	@Max(999999)
	@IsNotEmpty()
	otp: number
}