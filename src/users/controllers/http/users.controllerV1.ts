import { Controller, Get } from '@nestjs/common';

@Controller({
	path: 'users',
	version: '1',
})
export class UsersControllerV1 {
	constructor() {}

	@Get()
	getHello() {
		return 'Hello Users';
	}
}
