import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthControllerV1 } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
	imports: [JwtModule.register({})],
	providers: [AuthService, AtStrategy, RtStrategy, JwtService],
	controllers: [AuthControllerV1],
})
export class AuthModule {}
