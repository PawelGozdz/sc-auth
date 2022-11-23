export type IAuthController = {
	signin: (bodyDto: any, res: Response) => any | Promise<any>;
	signup: (bodyDto: any, res: Response) => Promise<any>;
};
