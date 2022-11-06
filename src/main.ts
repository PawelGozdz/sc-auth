import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: 'localhost',
			port: 4000,
		},
	});

	await app.startAllMicroservices();
	await app.listen(3000);
	console.log('Auth microservice running');
}
bootstrap();
