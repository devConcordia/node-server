import {Password} from '../src/infrastructure/security/Password.mjs';

const a = Password.hash("1234");
console.log("hash", a);
console.log("verify(true): ", Password.verify(a, "1234"));
