import { ConflictException, Inject, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Tokens } from '../types';
import { User } from '@prisma/client';
import { UsersService } from '../../users/services';
import { AuthLocalDto } from '../dto';

@Injectable()
export class AuthService {
	constructor(@Inject(UsersService) private readonly usersService: UsersService, @Inject(JwtService) private readonly jwtService: JwtService) {}

	public async signupLocal(dto: AuthLocalDto): Promise<Tokens> {
		const hash = await this.hashData(dto.password);
		try {
			const user = await this.usersService.createtUser({
				email: dto.email,
				hash,
			});

			if (!user) throw new BadRequestException(`Couldn't create user...`);

			const tokens = await this.getTokens(user.id, user.email);

			await this.updatedtHash(user.id, tokens.refresh_token);

			return tokens;
		} catch (error: any) {
			if (error.code === 'P2002') {
				throw new ConflictException(`User with this email already exists!`);
			}
			throw error;
		}
	}

	public async signinLocal(dto: AuthLocalDto): Promise<Tokens> {
		const user = await this.usersService.getUser({ email: dto.email });

		if (!user) {
			throw new UnauthorizedException(`Invalid credentials`);
		}

		const passwordMatch = await this.verifyPassword(user.hash, dto.password);

		if (!passwordMatch) {
			throw new UnauthorizedException(`Invalid credentials`);
		}

		const tokens = await this.getTokens(user.id, user.email);

		await this.updatedtHash(user.id, tokens.refresh_token);

		return tokens;
	}

	public async getAuthenticatedUserWithEmailAndPassword(email: string, password: string): Promise<User> {
		const user = await this.usersService.getUser({ email });

		if (!user) throw new UnauthorizedException(`Invalid credentials`);

		await this.verifyPassword(user.hash, password);

		return user;
	}

	public async logout(userId: string) {
		await this.usersService.updateOne(
			{
				id: userId,
				hashedRt: {
					not: null,
				},
			},
			{
				hashedRt: null,
			},
		);
		return;
	}

	public async refreshTokens(userId: string, refreshToken: string) {
		const user: any = await this.usersService.getUser({ id: userId });

		if (!user || !user.hashedRt) throw new UnauthorizedException(`Invalid credentials`);

		const refreshTokenMatches = await argon2.verify(user.hashedRt, refreshToken);

		if (!refreshTokenMatches) throw new UnauthorizedException(`Invalid credentials`);

		const tokens = await this.getTokens(user.id, user.email);

		await this.updatedtHash(user.id, tokens.refresh_token);

		return tokens;
	}

	// Utitlities

	public async verifyPassword(hash: string, password: string): Promise<boolean> {
		const passwordMatches = await this.passwordVerify(hash, password);

		if (typeof passwordMatches !== 'boolean') {
			throw new UnauthorizedException(`Invalid credentials`);
		}

		return passwordMatches;
	}

	public async getTokens(userId: string, email: string) {
		const accessToken = this.jwtService.signAsync(
			{
				sub: userId,
				email,
			},
			{
				secret: 'at-secret',
				expiresIn: 60 * 15,
			},
		);
		const refreshToken = this.jwtService.signAsync(
			{
				sub: userId,
				email,
			},
			{
				secret: 'rt-secret',
				expiresIn: 60 * 60 * 24 * 7,
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
			const hash = await this.hashData(rt);

			return this.usersService.updateOne({ id: userId }, { hashedRt: hash });
		} catch (error) {
			throw error;
		}
	}

	private async hashData(data: string) {
		return argon2.hash(data, { timeCost: 36 });
	}

	private async passwordVerify(hash: string, password: string) {
		return await argon2.verify(hash, password);
	}
}
