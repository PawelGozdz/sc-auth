import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
	// @ts-ignore
	constructor(private configService: ConfigService) {
		super({
			datasources: {
				db: {
					url: configService.get('DATABASE_URL'),
				},
			},
		});
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

	async cleanDatabase() {
		if (this.configService.get('NODE_ENV') === 'production') return;

		const models = Reflect.ownKeys(this)
			// @ts-expect-error
			.filter((key: any) => key[0] !== '_' && 'deleteMany' in this[key]);

		// @ts-expect-error
		return Promise.all(models.map((modelKey: any) => this[modelKey].deleteMany()));
	}
}
