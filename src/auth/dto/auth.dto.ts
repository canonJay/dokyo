import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string
}

export class VerifyOtpDto {
	@IsNumber()
	@Min(100000)
	@Max(999999)
	@IsNotEmpty()
	otp: number
}