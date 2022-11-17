import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

	public async getUniqueUser(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect | null | undefined): Promise<User> {
		try {
			return (await this.prisma.user.findUnique({
				where,
				select,
			})) as User;
		} catch (error) {
			throw error;
		}
	}

	public async getUser(where: Prisma.UserWhereInput, select?: Prisma.UserSelect | null | undefined): Promise<User> {
		try {
			return (await this.prisma.user.findFirst({
				where,
				select,
			})) as User;
		} catch (error) {
			throw error;
		}
	}

	public async createtUser(query: { email: string; hash: string }): Promise<User> {
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

	public async updateOne(where: Prisma.UserWhereUniqueInput, data: Partial<User>, select?: Prisma.UserSelect | null | undefined): Promise<User> {
		try {
			// @ts-ignore
			return await this.prisma.user.update({
				where,
				data,
				select,
			});
		} catch (error) {
			throw error;
		}
	}
}
