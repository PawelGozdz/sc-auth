import { Controller, Post, Inject, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLocalDto } from './dto';
import { Tokens } from './types';

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthControllerV1 {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	@Post('/local/signup')
	signupLocal(@Body() bodyDto: AuthLocalDto): Promise<Tokens> {
		return this.authService.signupLocal(bodyDto);
	}

	@Post('/local/signin')
	signinLocal(@Body() bodyDto: AuthLocalDto): Promise<Tokens> {
		return this.authService.signinLocal(bodyDto);
	}

	@Post('/logout')
	logout() {
		this.authService.logout();
	}

	@Post('/refresh')
	refreshTokens() {
		this.authService.refreshTokens();
	}
}
