import { Module } from '@nestjs/common';
import { AuthService } from './services';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users';
import { AuthControllerV1, AuthJwtControllerV1, AuthLocalControllerV1 } from './controllers/http';

@Module({
	imports: [JwtModule.register({}), UsersModule],
	providers: [AuthService, AtStrategy, RtStrategy, JwtService],
	controllers: [AuthControllerV1, AuthLocalControllerV1, AuthJwtControllerV1],
})
export class AuthModule {}
