import { User } from '@prisma/client';
import { Response } from 'express';

type AuthResponse = {
	user: User;
};

export type IAuthController = {
	signin: (bodyDto: any, res: Response) => Promise<Response<AuthResponse>>;
	signup: (bodyDto: any, res: Response) => Promise<Response<AuthResponse>>;
};
