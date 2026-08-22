import {MainDatabaseExecutor} from '../src/infrastructure/database/MainDatabaseExecutor.mjs';
import {PasswordHasher} from '../src/infrastructure/security/PasswordHasher.mjs';

import {AppSettings} from '../src/infrastructure/AppSettings.mjs';

import {AccountRepository} from '../src/modules/auth/infrastructure/repositories/AccountRepository.mjs';
import {Account} from '../src/modules/auth/domain/Account.mjs';
import {AccountStatus} from '../src/modules/auth/domain/enum/AccountStatus.mjs';
import {RoleRepository} from '../src/modules/auth/infrastructure/repositories/RoleRepository.mjs';

///
const settings = new AppSettings();

const passwordHasher = new PasswordHasher();

const mainDatabaseExecutor = new MainDatabaseExecutor(settings);

const accountRepository = new AccountRepository(mainDatabaseExecutor);
const roleRepository = new RoleRepository(mainDatabaseExecutor);

let account, role;

account = new Account({
	name: 'master',
	email: 'master@email.com',
	status: AccountStatus.ACTIVE,
	password_hash: await passwordHasher.hash("1234")
});

console.log('accountRepository.create: ', accountRepository.create(account));

role = roleRepository.findOneByName('MASTER');
account = accountRepository.findOneByEmail(account.email);

accountRepository.assignRole(account.id, role.id);

