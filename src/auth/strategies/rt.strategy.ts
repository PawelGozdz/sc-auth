import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../services';
import { JwtPayload } from '../types';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private authService: AuthService,
		// @ts-ignore
		private configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.Refresh;
				},
			]),
			secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<User> {
		const refreshToken = req.cookies?.Refresh;

		if (!refreshToken || typeof refreshToken !== 'string') throw new UnauthorizedException(`Invalid credentials`);

		const user = await this.authService.getAuthenticatedUserWithRefreshToken(payload.id, refreshToken);

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		req.refreshToken = refreshToken;

		return user;
	}
}
