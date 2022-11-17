import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

	public async getUser(where: Prisma.UserWhereInput, select?: Prisma.UserSelect | null | undefined) {
		try {
			return await this.prisma.user.findUnique({
				// @ts-ignore
				where,
				select,
			});
		} catch (error) {
			throw error;
		}
	}

	public async createtUser(query: { email: string; hash: string }) {
		try {
			return await this.prisma.user.create({
				data: {
					...query,
				},
			});
		} catch (error) {
			throw error;
		}
	}

	public async updateOne(where: Prisma.UserWhereInput, data: Partial<User>, select?: Prisma.UserSelect | null | undefined): Promise<User> {
		try {
			return await this.prisma.user.update({
				// @ts-ignore
				where,
				data,
				select,
			});
		} catch (error) {
			throw error;
		}
	}
}
