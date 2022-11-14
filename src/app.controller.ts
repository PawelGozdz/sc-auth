import { Controller, Get } from '@nestjs/common';

@Controller({
	path: '',
	version: '1',
})
export class AppController {
	@Get('/health')
	getHello(): string {
		return 'authhh';
	}
}
