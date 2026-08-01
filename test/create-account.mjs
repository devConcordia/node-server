import {MainDatabaseExecutor} from '../src/infrastructure/database/MainDatabaseExecutor.mjs';
import {Password} from '../src/infrastructure/security/Password.mjs';

import {AppSettings} from '../src/infrastructure/AppSettings.mjs';

import {AccountRepository} from '../src/modules/auth/infrastructure/repositories/AccountRepository.mjs';
import {Account} from '../src/modules/auth/domain/Account.mjs';

///
const settings = new AppSettings();

settings.load();

const mainDatabaseExecutor = new MainDatabaseExecutor(settings);

const accountRepository = new AccountRepository(mainDatabaseExecutor);

const account = new Account({
	name: 'master',
	email: 'master@email.com',
	password_hash: Password.hash("1234")
});


console.log('account.create: ', accountRepository.create(account));

console.log('account', accountRepository.find());
