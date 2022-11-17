import { Module } from '@nestjs/common';
import { UsersControllerV1 } from './controllers';
import { UsersService } from './services';

@Module({
	controllers: [UsersControllerV1],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
