import { Controller, Post, Inject, Body, HttpCode, HttpStatus, Req, UnauthorizedException } from '@nestjs/common';
import { AuthLocalDto } from '../../dto';
import { Request } from 'express';
import { AuthService, CookiesService } from '../../services';
import { Public } from '../../../common';
import { User } from '@prisma/client';
import { UsersService } from '../../../users';
import { Tokens } from '../../../auth/types';

@Controller({
	path: 'auth/local',
	version: '1',
})
export class AuthLocalControllerV1 {
	constructor(
		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(CookiesService) private readonly cookieService: CookiesService,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	@Public()
	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() bodyDto: AuthLocalDto, @Req() req: Request) {
		const user = await this.authService.createUser(bodyDto);

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		const tokens: Tokens = await this.authService.signupLocal(user);

		const accessCookie = await this.cookieService.getCookieWithJwtAccessToken(tokens.access_token);
		const refreshCookie = await this.cookieService.getCookieWithJwtRefreshToken(tokens.refresh_token);

		req.res!.setHeader('Set-Cookie', [accessCookie.cookie, refreshCookie.cookie]);

		return user;
	}

	@Public()
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Body() bodyDto: AuthLocalDto, @Req() req: Request) {
		const user: User = await this.usersService.getUniqueUser({ email: bodyDto.email });

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		const tokens: Tokens = await this.authService.signupLocal(user);

		const accessCookie = await this.cookieService.getCookieWithJwtAccessToken(tokens.access_token);
		const refreshCookie = await this.cookieService.getCookieWithJwtRefreshToken(tokens.refresh_token);

		req.res!.setHeader('Set-Cookie', [accessCookie.cookie, refreshCookie.cookie]);

		return user;
	}
}
