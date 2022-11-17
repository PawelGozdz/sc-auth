import { IsEmail, IsNotEmpty, IsString, IsDefined } from 'class-validator';

export class GlobalDto {
	@IsDefined()
	@IsEmail()
	email: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	password: string;
}
