import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../services';
import { JwtPayload } from '../types';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private authService: AuthService,
		// @ts-ignore
		private configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					return req?.cookies?.Authentication;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<User> {
		const accessToken = req?.cookies?.Authentication;

		if (!accessToken || typeof accessToken !== 'string' || accessToken === '') throw new UnauthorizedException(`Invalid credentials`);

		const user = await this.authService.getAuthenticatedUserWithJwt(payload.id);

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		return user;
	}
}
