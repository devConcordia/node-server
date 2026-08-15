import {PasswordHasher} from '../src/infrastructure/security/PasswordHasher.mjs';

const passwordHasher = new PasswordHasher();

try {

	const a = await passwordHasher.hash("1234");

	console.log("hash", a);
	console.log("verify(true): ", await passwordHasher.verify(a, "1234"));

} catch (error) {

	console.log(error);

}