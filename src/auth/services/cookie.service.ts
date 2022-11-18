import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookiesService {
	constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

	public async getCookieWithJwtAccessToken(accessToken: string) {
		if (!accessToken) throw new BadRequestException(`Provide all the data!`);

		return {
			cookie: `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`,
		};
	}

	public async getCookieWithJwtRefreshToken(refreshToken: string) {
		if (!refreshToken) throw new BadRequestException(`Provide all the data!`);

		return {
			cookie: `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`,
		};
	}

	public getCookieForLogOut() {
		return [`Authentication=; HttpOnly; Path=/; Max-Age=0`, `Refresh=; HttpOnly; Path=/; Max-Age=0`];
	}
}
