import { Tokens } from './';

export type IAuthController = {
	signin: (bodyDto: any) => Promise<Tokens>;
	signup: (bodyDto: any) => Promise<Tokens>;
};
