//@ts-nocheck
import { Test } from '@nestjs/testing';
import { HashService } from 'src/auth';
import { UsersService } from 'src/users/services';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../prisma';

describe('UsersServcie Int', () => {
	let prisma: PrismaService;
	let hashService: HashService;
	let usersService: UsersService;
	let password;
	let email;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		prisma = moduleRef.get(PrismaService);
		hashService = moduleRef.get(HashService);
		usersService = moduleRef.get(UsersService);
		await prisma.cleanDatabase();

		password = 'abcd';
		email = 'test@test.com';
	});

	describe('createtUser', () => {
		let userId: string;
		it('should create user', async () => {
			const hash = await hashService.hashData(password);

			const user = await usersService.createtUser({
				email,
				hash,
			});

			userId = user.id;

			expect(user.hash).toBe(hash);
			expect(user.email).toBe(email);
			expect(user.id).toContain('-');
		});
		it('should throw duplicate error', async () => {
			const hash = await hashService.hashData(password);

			const user = await usersService
				.createtUser({
					email,
					hash,
				})
				.then((user) => expect(user).not.toBeUndefined())
				.catch((error) => {
					expect(error.status).toBe(409);
				});
		});
	});

	describe('getUniqueUser', () => {
		let user: User;

		it('should pick unique ( 2nd ) user', async () => {
			const hash1 = await hashService.hashData(password);
			const user1 = await usersService.createtUser({
				email: 'test1@test.com',
				hash: hash1,
			});

			const hash2 = await hashService.hashData(password);
			const user2 = await usersService.createtUser({
				email: 'test2@test.com',
				hash: hash2,
			});

			const getUser = await usersService.getUniqueUser({
				id: user2.id,
			});

			expect(user2.id).toEqual(getUser.id);
		});
	});

	describe('getUser', () => {
		it('should get user', async () => {
			const hash = await hashService.hashData(password);
			const email = 'test4@test.com';
			const user1 = await usersService.createtUser({
				email,
				hash: hash,
			});

			const getUser = await usersService.getUser({
				email: email,
			});

			expect(getUser.email).toEqual(email);
		});

		it('should get user and select only email', async () => {
			const hash = await hashService.hashData(password);
			const email = 'test5@test.com';
			const user1 = await usersService.createtUser({
				email,
				hash: hash,
			});

			const getUser = await usersService.getUser(
				{
					email: email,
				},
				{
					email: true,
				},
			);

			expect(getUser.email).toEqual(email);
			expect(getUser.id).toBeUndefined();
		});
	});

	describe('updateOne', () => {
		let user;
		let updatedUser;
		it('should update user', async () => {
			const email = 'test6@test.com';
			const updatedEmail = 'test7@test.com';
			const hash = await hashService.hashData(password);

			user = await usersService.createtUser({
				email,
				hash: hash,
			});

			updatedUser = await usersService.updateOne({ id: user.id }, { email: updatedEmail }, { email: true });

			expect(updatedUser.email).toEqual(updatedEmail);
			expect(updatedUser.id).toBeUndefined();
		});

		it('should throw if user not found', async () => {
			const uuid = '7450b5d3-962e-4e78-a1e5-86267811f149';
			const email = 'test6@test.com';
			const updatedEmail = 'test7@test.com';
			const fakeId = 'asdfasfd';
			const hash = await hashService.hashData(password);

			user = await usersService.createtUser({
				email,
				hash: hash,
			});

			updatedUser = await usersService
				.updateOne({ id: uuid }, { email: updatedEmail }, { email: true })
				.then((user) => expect(user).not.toBeUndefined())
				.catch((error) => {
					expect(error.status).toBe(404);
				});
		});
	});

	it.todo('Should pass');
});
