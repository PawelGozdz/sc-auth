import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../../users/services';
import { AuthLocalDto } from '../dto';
import { HashService } from './hash.service';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '../types';

@Injectable()
export class AuthService {
	constructor(
		@Inject(UsersService) private readonly usersService: UsersService,
		@Inject(JwtService) private readonly jwtService: JwtService,
		@Inject(HashService) private readonly hashService: HashService,
		@Inject(ConfigService) private readonly configService: ConfigService,
	) {}

	public async createUser(dto: AuthLocalDto) {
		try {
			const hash = await this.hashService.hashData(dto.password);
			const user = await this.usersService.createtUser({
				email: dto.email,
				hash,
			});

			return user;
		} catch (error: any) {
			if (error.code === 'P2002') {
				throw new ConflictException(`User with this email already exists!`);
			}
			throw error;
		}
	}

	public async signupLocal(user: User): Promise<Tokens> {
		try {
			const tokens = await this.getTokens(user.id);

			await this.updatedtHash(user.id, tokens.refresh_token);

			return tokens;
		} catch (error: any) {
			throw error;
		}
	}

	public async signinLocal(dto: AuthLocalDto, user: User): Promise<Tokens> {
		if (!user) {
			throw new UnauthorizedException(`Invalid credentials`);
		}

		const passwordMatch = await this.verifyTextToHash(user.hash, dto.password);

		if (!passwordMatch) {
			throw new UnauthorizedException(`Invalid credentials`);
		}

		const tokens = await this.getTokens(user.id);

		await this.updatedtHash(user.id, tokens.refresh_token);

		return tokens;
	}

	public async getAuthenticatedUserWithEmailAndPassword(email: string, password: string): Promise<User> {
		if (!password || typeof password !== 'string' || !email || typeof email !== 'string') throw new UnauthorizedException(`Invalid credentials`);

		const user = await this.usersService.getUniqueUser({ email });

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		const passwordMatch = await this.verifyTextToHash(user.hash, password);

		if (!passwordMatch) throw new UnauthorizedException(`Invalid credentials`);

		return user;
	}

	public async getAuthenticatedUserWithJwt(userId: string): Promise<User> {
		if (!userId || typeof userId !== 'string') throw new UnauthorizedException(`Invalid credentials`);

		const user = await this.usersService.getUser({ id: userId });

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		return user;
	}

	public async getAuthenticatedUserWithRefreshToken(userId: string, token: string): Promise<User> {
		if (!userId || typeof userId !== 'string' || !token || typeof token !== 'string') throw new UnauthorizedException(`Invalid credentials`);

		const user = await this.usersService.getUser({ id: userId });

		if (!user || !user.hashedRt) throw new UnauthorizedException(`Invalid credentials`);

		const isAuth = await this.hashService.hashAndTextVerify(user.hashedRt!, token);

		if (!isAuth) throw new UnauthorizedException(`Invalid credentials`);

		return user;
	}

	public async logout(userId: string) {
		await this.usersService.updateOne({ id: userId }, { hashedRt: null });
		return;
	}

	public async refreshTokens(user: User, refreshToken: string) {
		if (!user || !user.hashedRt || !refreshToken || typeof refreshToken !== 'string') throw new UnauthorizedException(`Invalid credentials`);

		const refreshTokenMatches = await this.hashService.hashAndTextVerify(user.hashedRt, refreshToken);

		if (!refreshTokenMatches) throw new UnauthorizedException(`Invalid credentials`);

		const tokens = await this.getTokens(user.id);

		await this.updatedtHash(user.id, tokens.refresh_token);

		return tokens;
	}

	// Utitlities

	public async verifyTextToHash(hash: string, password: string): Promise<boolean> {
		const passwordMatches = await this.hashService.hashAndTextVerify(hash, password);

		if (typeof passwordMatches !== 'boolean') {
			throw new UnauthorizedException(`Invalid credentials`);
		}

		return passwordMatches;
	}

	public async getTokens(userId: string) {
		const accessToken = this.jwtService.signAsync(
			{
				id: userId,
			},
			{
				secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
				expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
			},
		);
		const refreshToken = this.jwtService.signAsync(
			{
				id: userId,
			},
			{
				secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
				expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
			},
		);
		const [at, rt] = await Promise.all([accessToken, refreshToken]);

		return {
			access_token: at,
			refresh_token: rt,
		};
	}

	async updatedtHash(userId: string, rt: string) {
		try {
			const hash = await this.hashService.hashData(rt);

			return this.usersService.updateOne({ id: userId }, { hashedRt: hash });
		} catch (error) {
			throw error;
		}
	}
}
