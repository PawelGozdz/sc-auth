import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../services';
import { JwtPayload } from '../types';
import { User } from '@prisma/client';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: 'at-secret',
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<User> {
		const accessToken = req.get('Authorization')?.replace('Bearer', '').trim();

		if (!accessToken || typeof accessToken !== 'string') throw new UnauthorizedException(`Invalid credentials`);

		const user = await this.authService.getAuthenticatedUserWithJwt(payload.sub, payload.email);

		return user;
	}
}
