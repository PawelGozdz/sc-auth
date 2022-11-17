import { Controller, Post, Inject, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthLocalDto } from '../../dto';
import { AuthService } from '../../services';
import { IAuthController, Tokens } from '../../types';
import { Public } from '../../../common';

@Controller({
	path: 'auth/local',
	version: '1',
})
export class AuthLocalControllerV1 implements IAuthController {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	@Public()
	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	signup(@Body() bodyDto: AuthLocalDto): Promise<Tokens> {
		return this.authService.signupLocal(bodyDto);
	}

	@Public()
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	signin(@Body() bodyDto: AuthLocalDto): Promise<Tokens> {
		return this.authService.signinLocal(bodyDto);
	}
}
