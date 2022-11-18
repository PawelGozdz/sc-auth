import { Module } from '@nestjs/common';
import { AuthService, CookiesService, HashService } from './services';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users';
import { AuthControllerV1, AuthLocalControllerV1 } from './controllers/http';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
				},
			}),
		}),
		UsersModule,
	],
	providers: [AuthService, AtStrategy, RtStrategy, JwtService, CookiesService, HashService],
	controllers: [AuthControllerV1, AuthLocalControllerV1],
})
export class AuthModule {}
