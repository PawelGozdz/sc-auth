import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../services';
import { JwtPayload } from '../types';
import { User } from '@prisma/client';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: 'rt-secret',
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<User> {
		const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

		if (!refreshToken || typeof refreshToken !== 'string') throw new UnauthorizedException(`Invalid credentials`);

		const user = await this.authService.getAuthenticatedUserWithJwt(payload.sub, payload.email);

		req.refreshToken = refreshToken;

		return user;
	}
}
