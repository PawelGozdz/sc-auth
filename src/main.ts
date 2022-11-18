import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.use(cookieParser());

	const config = app.get(ConfigService);

	app.setGlobalPrefix('api');

	app.enableVersioning({
		type: VersioningType.URI,
	});

	app.use(helmet());

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		}),
	);

	app.enableShutdownHooks();

	const PORT = config.get('PORT');

	await app.listen(PORT, () => console.log(`PORT ${PORT}`));
}
bootstrap();
