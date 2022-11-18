import { UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'email',
			passReqToCallback: true,
		});
	}
	async validate(_: Request, email: string, password: string): Promise<User> {
		const user = await this.authService.getAuthenticatedUserWithEmailAndPassword(email, password);

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		return user;
	}
}
