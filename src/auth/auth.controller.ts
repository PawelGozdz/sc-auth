import { Controller, Post, Inject, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { AuthLocalDto } from './dto';
import { Tokens } from './types';

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthControllerV1 {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	@Public()
	@Post('/local/signup')
	@HttpCode(HttpStatus.CREATED)
	signupLocal(@Body() bodyDto: AuthLocalDto): Promise<Tokens> {
		return this.authService.signupLocal(bodyDto);
	}

	@Public()
	@Post('/local/signin')
	@HttpCode(HttpStatus.OK)
	signinLocal(@Body() bodyDto: AuthLocalDto): Promise<Tokens> {
		return this.authService.signinLocal(bodyDto);
	}

	@Post('/logout')
	@HttpCode(HttpStatus.OK)
	logout(@GetCurrentUser('sub') userId: string) {
		return this.authService.logout(userId);
	}

	@Public()
	@UseGuards(RtGuard)
	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	refreshTokens(@GetCurrentUser() user: any) {
		return this.authService.refreshTokens(user.sub, user['refreshToken']);
	}
}
