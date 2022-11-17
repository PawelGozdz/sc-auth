import { Controller, Post, Inject, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../services';
import { AuthLocalDto } from '../../dto';
import { IAuthController, Tokens } from '../../types';
import { Public } from '../../../common';

@Controller({
	path: 'auth/jwt',
	version: '1',
})
export class AuthJwtControllerV1 implements IAuthController {
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
