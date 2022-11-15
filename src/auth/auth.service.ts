import { ConflictException, Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Tokens } from './types';
import { AuthLocalDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(JwtService) private readonly jwtService: JwtService) {}

	public async signupLocal(dto: AuthLocalDto): Promise<Tokens> {
		const hash = await this.hashData(dto.password);
		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash,
				},
			});

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
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});

		if (!user) {
			throw new ForbiddenException(`Access Denied`);
		}

		const passwordMatch = await this.verifyPassword(user, dto.password);

		if (!passwordMatch) {
			throw new ForbiddenException(`Access Denied`);
		}

		const tokens = await this.getTokens(user.id, user.email);

		await this.updatedtHash(user.id, tokens.refresh_token);

		return tokens;
	}

	public async logout(userId: string) {
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRt: {
					not: null,
				},
			},
			data: {
				hashedRt: null,
			},
		});
		return;
	}

	public async refreshTokens(userId: string, refreshToken: string) {
		const user: any = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user || !user.hashedRt) throw new ForbiddenException(`Access Denied!`);

		const refreshTokenMatches = await argon2.verify(user.hashedRt, refreshToken);

		if (!refreshTokenMatches) throw new ForbiddenException(`Access Denied!`);

		const tokens = await this.getTokens(user.id, user.email);

		await this.updatedtHash(user.id, tokens.refresh_token);

		return tokens;
	}

	// Utitlities

	public async verifyPassword(user: User, password: string): Promise<boolean> {
		const passwordMatches = await argon2.verify(user.hash, password);

		if (typeof passwordMatches !== 'boolean') {
			throw new ForbiddenException(`Access Denied`);
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
		const hash = await this.hashData(rt);
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				hashedRt: hash,
			},
		});
	}

	private async hashData(data: string) {
		return argon2.hash(data, { timeCost: 36 });
	}
}
