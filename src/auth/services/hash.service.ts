import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
	public async verifyPassword(hash: string, password: string): Promise<boolean> {
		const passwordMatches = await this.hashAndTextVerify(hash, password);

		return passwordMatches;
	}

	async updatedtHash(rt: string) {
		try {
			const hash = await this.hashData(rt);

			return hash;
		} catch (error) {
			throw error;
		}
	}

	public async hashData(data: string) {
		return argon2.hash(data, { timeCost: 6 });
	}

	public async hashAndTextVerify(hash: string, text: any) {
		return await argon2.verify(hash, text);
	}
}
