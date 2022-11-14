import { IsEmail, IsNotEmpty, IsString, IsDefined } from 'class-validator';

export class AuthLocalDto {
	@IsDefined()
	@IsEmail()
	email: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	password: string;
}
