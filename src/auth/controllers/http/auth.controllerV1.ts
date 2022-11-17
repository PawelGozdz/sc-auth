import { Controller, Post, Inject, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from '../../services';
import { Tokens } from '../../types';
import { GetCurrentUser, Public } from '../../../common';
import { RtGuard } from '../../../common';

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthControllerV1 {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	@Post('/logout')
	@HttpCode(HttpStatus.OK)
	logout(@GetCurrentUser('sub') userId: string) {
		return this.authService.logout(userId);
	}

	@Public()
	@UseGuards(RtGuard)
	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	refreshTokens(@GetCurrentUser() user: any): Promise<Tokens> {
		return this.authService.refreshTokens(user.sub, user['refreshToken']);
	}
}
