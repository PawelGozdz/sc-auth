import { Module } from '@nestjs/common';
import { validationSchema } from './config/validation';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { AppController } from './app.controller';
import { AtGuard } from './common/guards';
import { UsersModule } from './users';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema,
			validationOptions: {
				abortEarly: false,
			},
		}),
		PrismaModule,
		AuthModule,
		UsersModule,
	],
	providers: [{ provide: 'APP_GUARD', useClass: AtGuard }],
	controllers: [AppController],
})
export class AppModule {}
