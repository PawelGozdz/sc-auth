import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetRefreshToken = createParamDecorator((_: undefined, context: ExecutionContext): User => {
	const request = context.switchToHttp().getRequest();

	return request.refreshToken;
});
