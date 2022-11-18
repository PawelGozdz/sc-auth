import { Controller, Post, Inject, HttpCode, HttpStatus, UseGuards, Res } from '@nestjs/common';
import { AuthService, CookiesService } from '../../services';
import { Response } from 'express';
import { GetCurrentUser, GetRefreshToken, Public } from '../../../common';
import { RefreshTokenGuard } from '../../../common';
import { User } from '@prisma/client';

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthControllerV1 {
	constructor(
		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(CookiesService) private readonly cookieService: CookiesService,
	) {}

	@Post('/logout')
	@HttpCode(HttpStatus.OK)
	async logout(@GetCurrentUser() user: User, @Res() res: Response) {
		await this.authService.logout(user.id);

		res.setHeader('Set-Cookie', this.cookieService.getCookieForLogOut());

		return res.status(204).send({
			user,
		});
	}

	@Public()
	@UseGuards(RefreshTokenGuard)
	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	async refreshTokens(@GetCurrentUser() user: User, @GetRefreshToken() token: string, @Res() res: Response) {
		const tokens = await this.authService.refreshTokens(user, token);

		const accessCookie = await this.cookieService.getCookieWithJwtAccessToken(tokens.access_token);
		const refreshCookie = await this.cookieService.getCookieWithJwtRefreshToken(tokens.refresh_token);

		res.setHeader('Set-Cookie', [accessCookie.cookie, refreshCookie.cookie]);

		return res.send({
			user,
		});
	}
}
