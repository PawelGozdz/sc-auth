import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetCurrentUser = createParamDecorator((data: string | undefined, context: ExecutionContext): User => {
	const request = context.switchToHttp().getRequest();

	if (!data) return request.user;
	return request?.user[data];
});
