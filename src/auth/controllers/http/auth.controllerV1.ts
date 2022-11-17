import { Controller, Post, Inject, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from '../../services';
import { Tokens } from '../../types';
import { GetCurrentUser, GetRefreshToken, Public } from '../../../common';
import { RtGuard } from '../../../common';
import { User } from '@prisma/client';

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthControllerV1 {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	@Post('/logout')
	@HttpCode(HttpStatus.OK)
	logout(@GetCurrentUser() user: User) {
		return this.authService.logout(user.id);
	}

	@Public()
	@UseGuards(RtGuard)
	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	refreshTokens(@GetCurrentUser() user: User, @GetRefreshToken() token: string): Promise<Tokens> {
		return this.authService.refreshTokens(user, token);
	}
}
