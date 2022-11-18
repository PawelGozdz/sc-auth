import { Controller, Post, Inject, Body, HttpCode, HttpStatus, Res, Get, UnauthorizedException } from '@nestjs/common';
import { AuthLocalDto } from '../../dto';
import { Response } from 'express';
import { AuthService, CookiesService } from '../../services';
import { IAuthController, Tokens } from '../../types';
import { Public } from '../../../common';
import { User } from '@prisma/client';
import { UsersService } from '../../../users';

@Controller({
	path: 'auth/local',
	version: '1',
})
export class AuthLocalControllerV1 implements IAuthController {
	constructor(
		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(CookiesService) private readonly cookieService: CookiesService,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	@Public()
	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() bodyDto: AuthLocalDto, @Res() res: Response) {
		const user = await this.authService.createUser(bodyDto);

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		const tokens: Tokens = await this.authService.signupLocal(user);

		const accessCookie = await this.cookieService.getCookieWithJwtAccessToken(tokens.access_token);
		const refreshCookie = await this.cookieService.getCookieWithJwtRefreshToken(tokens.refresh_token);

		res.setHeader('Set-Cookie', [accessCookie.cookie, refreshCookie.cookie]);

		return res.send({
			user,
		});
	}

	@Get('/user')
	getUser() {
		return 'zalogowany :)';
	}

	// @Public()
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Body() bodyDto: AuthLocalDto, @Res() res: Response) {
		const user: User = await this.usersService.getUniqueUser({ email: bodyDto.email });

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		const tokens: Tokens = await this.authService.signupLocal(user);

		const accessCookie = await this.cookieService.getCookieWithJwtAccessToken(tokens.access_token);
		const refreshCookie = await this.cookieService.getCookieWithJwtRefreshToken(tokens.refresh_token);

		res.setHeader('Set-Cookie', [accessCookie.cookie, refreshCookie.cookie]);

		return res.send({
			users: user,
		});
	}
}
