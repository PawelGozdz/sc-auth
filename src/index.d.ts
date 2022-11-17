import * as express from 'express';
import { User } from '@prisma/client';
import { Tokens } from './auth';

declare global {
	namespace Express {
		interface Request {
			user?: User;
			refreshToken?: Tokens['refresh_token'];
		}
	}
}
