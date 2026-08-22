# Node Server

A lightweight, zero-dependency Node.js server framework designed with Clean Architecture and Domain-Driven Design (DDD)
principles. It leverages modern, native Node.js capabilities including native ECMAScript Modules (ESM), built-in
SQLite (`node:sqlite`), native environment file loading (`--env-file`), and built-in cryptography (`node:crypto`).

---

## Features

- **Zero External Dependencies**: Built entirely with Node.js standard libraries.
- **Native SQLite Integration**: Out-of-the-box support for database persistence and migrations using `node:sqlite`.
- **Clean & Modular Architecture**: Clear separation of concerns into Domain, Application, and Infrastructure layers.
- **Built-in Inversion of Control (IoC) Container**: Dependency injection supporting `singleton`, `scoped`, and
  `transient` lifecycles.
- **Routing & Handlers**: Declarative route registration with parameter extraction (`/api/resource/:id`), regex pattern
  matching, and middleware-free handler pipelines.
- **Security & Auth**: Built-in Password Hasher (scrypt), JSON Web Token (JWT) generator/validator, and
  Role/Permission-based Access Control (RBAC).
- **Server-Sent Events (SSE)**: Native streaming support.
- **Structured Logging**: Multi-transport logger (Console and File transports).

---

## Prerequisites

- **Node.js**: v22.0.0 or later (required for native `--experimental-sqlite` and `--env-file` support).

---

## Getting Started

### 1. Environment Configuration

Copy the example environment file and adjust configuration values as needed:

```bash
cp .env.example .env
```

#### Environment Variables

| Variable         | Description                                   | Default                      |
|------------------|-----------------------------------------------|------------------------------|
| `DEBUG`          | Enable debug logging output (`true`/`false`)  | `true`                       |
| `SERVER_HOST`    | Host interface to bind the HTTP server        | `localhost`                  |
| `SERVER_PORT`    | Port number for the HTTP server               | `8000`                       |
| `BASE_URL`       | Application base URL                          | `http://localhost:8080`      |
| `JWT_SECRET`     | Secret key used for signing JWT tokens        | `your server secret to jwt`  |
| `JWT_ALGORITHM`  | Cryptographic algorithm for JWT               | `HS256`                      |
| `DB_MAIN_PATH`   | File path to SQLite database file             | `./data/main.sqlite`         |
| `DB_MAIN_CONFIG` | Path to SQL migrations and schema definitions | `./resources/databases/main` |
| `LOG_PATH`       | Directory path for file-based error logs      | `./data/logs`                |

### 2. Database Migrations

Run database migrations to initialize SQLite tables and baseline data:

```bash
npm run migrations
```

or

```bash
node --no-warnings --env-file=.env --experimental-sqlite ./scripts/migrations.mjs
```

### 3. Run the Server

Start the HTTP server:

```bash
npm run server
```

or

```bash
node --no-warnings --env-file=.env --experimental-sqlite src/main.mjs
```

The server will be available at `http://localhost:8000` (or the configured `SERVER_PORT`).

---

## Project Structure

```text
node-server/
├── data/                             # SQLite database files and runtime logs
├── resources/
│   └── databases/
│       └── main/
│           ├── migrations/           # Incremental SQL migration scripts
│           └── schema.sql            # Base schema definitions
├── scripts/
│   └── migrations.mjs                # Database migration runner script
├── src/
│   ├── core/                         # Core framework primitives
│   │   ├── assertion/                # Validation utilities
│   │   ├── composition/              # IoC Container and Providers (DI)
│   │   ├── database/                 # Query builder, criteria, base repository
│   │   ├── encoding/                 # Base64, Hex encoding utilities
│   │   ├── logging/                  # Logger, console and file transports
│   │   ├── network/                  # HTTP server, router, handlers, contexts
│   │   ├── security/                 # Authenticator and authentication contracts
│   │   ├── serialization/            # Object serializers
│   │   ├── time/                     # Time utilities
│   │   ├── Application.mjs           # Base application bootstrap lifecycle
│   │   ├── Module.mjs                # Base module lifecycle
│   │   └── Settings.mjs              # Base environment settings parser
│   ├── infrastructure/               # Framework implementations
│   │   ├── database/                 # SQLite database executors
│   │   ├── rest/                     # REST server adapter
│   │   ├── security/                 # PasswordHasher, JWT, Authorize, Auth strategies
│   │   ├── App.mjs                   # Main application wiring & service registration
│   │   └── AppSettings.mjs           # Application environment settings
│   ├── modules/                      # Business feature modules
│   │   ├── admin/                    # Admin metrics and management
│   │   ├── auth/                     # Authentication, accounts, roles, permissions
│   │   └── ops/                      # Operational utilities (migrations, schema)
│   └── main.mjs                      # Application entrypoint
├── test/                             # Functional and integration tests
├── .env.example
├── package.json
└── README.md
```

---

## Architecture of a Module

Each feature module is encapsulated inside `src/modules/<module-name>/` following Clean Architecture:

```text
src/modules/<module-name>/
├── <ModuleName>Module.mjs            # Module entrypoint & DI container registrations
├── domain/                           # Enterprise business rules & entities
│   ├── <Entity>.mjs                  # Domain entity model
│   └── enum/                         # Domain enums & constants
├── application/                      # Application business rules (use cases)
│   ├── <Action>UseCase.mjs           # Use case orchestrating business workflows
│   └── dto/                          # Data Transfer Objects
└── infrastructure/                   # Interface adapters & infrastructure
    ├── handlers/                     # HTTP route handlers (controllers)
    │   └── <Action>Handler.mjs
    └── repositories/                 # Database repositories
        └── <Entity>Repository.mjs
```

---

## How to Create a New Module

This guide uses `modules/auth` as a reference to demonstrate creating a new module from scratch.

### Step 1: Define Domain Entities

Create domain entity classes in `domain/`. Entities encapsulate data structures and domain logic.

```javascript
// src/modules/auth/domain/Account.mjs
export class Account {
	constructor(data = {}) {
		this.id = data.id ?? null;
		this.email = data.email ?? null;
		this.name = data.name ?? null;
		this.password_hash = data.password_hash ?? null;
		this.status = data.status ?? 'active';
		this.created_at = data.created_at ? new Date(data.created_at) : null;
		this.updated_at = data.updated_at ? new Date(data.updated_at) : null;
	}
}
```

### Step 2: Create the Repository

Create a repository in `infrastructure/repositories/` extending `Repository` from `core/database/Repository.mjs`.

- Specify `TABLE_NAME` and `ENTITY_CLASS`.
- Inherits standard CRUD: `findById(id)`, `find(criteria)`, `create(entity)`, `update(entity)`, `deleteById(id)`.
- Add custom query methods as needed.

```javascript
// src/modules/auth/infrastructure/repositories/AccountRepository.mjs
import {Repository} from '../../../../core/database/Repository.mjs';
import {Account} from '../../domain/Account.mjs';

export class AccountRepository extends Repository {
	get TABLE_NAME() {
		return 'auth_accounts';
	}

	get ENTITY_CLASS() {
		return Account;
	}

	findOneByEmail(email) {
		return this.findOne(
			`SELECT * FROM ${this.TABLE_NAME} WHERE email = :email`,
			{email}
		);
	}
}
```

### Step 3: Implement Use Cases

Create use case classes in `application/`. Use cases contain business logic and interact with repositories and security
services via constructor injection.

```javascript
// src/modules/auth/application/CreateAccountUseCase.mjs
import {Account} from '../domain/Account.mjs';

export class CreateAccountUseCase {
	get PERMISSION() {
		return 'ACCOUNT_CREATE';
	}

	constructor(passwordHasher, accountRepository) {
		this.passwordHasher = passwordHasher;
		this.accountRepository = accountRepository;
	}

	async execute(input) {
		const hashedPassword = await this.passwordHasher.hash(input.password);

		const account = new Account({
			name: input.name,
			email: input.email,
			password_hash: hashedPassword,
			status: 'active'
		});

		return this.accountRepository.create(account);
	}
}
```

### Step 4: Create HTTP Request Handlers

Create handlers in `infrastructure/handlers/` extending `Handler` from `core/network/Handler.mjs`.

- Define static getters: `METHOD`, `ROUTE`, and `AUTH` strategies.
- Implement `isAuthorized(request)` to check permissions or roles.
- Implement `resolve(request, response)` to handle the incoming request and send a response.

```javascript
// src/modules/auth/infrastructure/handlers/CreateAccountHandler.mjs
import {Handler} from '../../../../core/network/Handler.mjs';
import {JWTAuthentication} from '../../../../infrastructure/security/authentications/JWTAuthentication.mjs';

export class CreateAccountHandler extends Handler {
	static get METHOD() {
		return 'POST';
	}

	static get ROUTE() {
		return '/api/accounts';
	}

	static get AUTH() {
		return [JWTAuthentication];
	}

	constructor(authorize, createAccountUseCase) {
		super();
		this.authorize = authorize;
		this.createAccountUseCase = createAccountUseCase;
	}

	isAuthorized(request) {
		const account = request.getCurrentAccount();
		if (account) {
			return this.authorize.hasPermission(account, this.createAccountUseCase.PERMISSION);
		}
		return false;
	}

	async resolve(request, response) {
		const payload = request.getPayload();

		if (!payload?.email || !payload?.password || !payload?.name) {
			response.replyError(400, 'BAD_REQUEST', 'Missing required fields');
			return;
		}

		const result = await this.createAccountUseCase.execute(payload);

		if (result < 1) {
			response.replyError(400, 'CREATE_FAILED', "Could not create account");
			return;
		}

		response.replyNoContent();
	}
}
```

### Step 5: Define the Module Class

Create `<ModuleName>Module.mjs` extending `Module` from `core/Module.mjs`.

- Use `onSetup(app)` to register repositories, use cases, and handlers into the DI `Container`.
    - `container.singleton(Type, factory)`: Single instance shared application-wide.
    - `container.scoped(Type, factory)`: Instance created once per resolution context.
    - `container.transient(Type, factory)`: New instance created on every resolution.
- Use `onAfterSetup(app)` to enable handlers in the `Router`.

```javascript
// src/modules/auth/AuthModule.mjs
import {Module} from '../../core/Module.mjs';
import {Router} from '../../core/network/Router.mjs';
import {AccountRepository} from './infrastructure/repositories/AccountRepository.mjs';
import {CreateAccountUseCase} from './application/CreateAccountUseCase.mjs';
import {CreateAccountHandler} from './infrastructure/handlers/CreateAccountHandler.mjs';
import {MainDatabaseExecutor} from '../../infrastructure/database/MainDatabaseExecutor.mjs';
import {PasswordHasher} from '../../infrastructure/security/PasswordHasher.mjs';
import {Authorize} from '../../infrastructure/security/Authorize.mjs';

export class AuthModule extends Module {
	onSetup(app) {
		const container = app.getContainer();

		// Repositories
		container.scoped(AccountRepository, (ctx) => {
			return new AccountRepository(ctx.get(MainDatabaseExecutor));
		});

		// Use Cases
		container.scoped(CreateAccountUseCase, (ctx) => {
			return new CreateAccountUseCase(
				ctx.get(PasswordHasher),
				ctx.get(AccountRepository)
			);
		});

		// Handlers
		container.transient(CreateAccountHandler, (ctx) => {
			return new CreateAccountHandler(
				ctx.get(Authorize),
				ctx.get(CreateAccountUseCase)
			);
		});
	}

	onAfterSetup(app) {
		const context = app.getContext();
		const router = context.get(Router);

		// Register routes in router
		router.enable(CreateAccountHandler);
	}
}
```

### Step 6: Register the Module in `main.mjs`

Import and mount the module using `app.use()` before starting the server:

```javascript
// src/main.mjs
import {App} from './infrastructure/App.mjs';
import {AuthModule} from './modules/auth/AuthModule.mjs';
import {AdminModule} from './modules/admin/AdminModule.mjs';

try {
	const app = new App();

	app.use(new AuthModule());
	app.use(new AdminModule());

	await app.create();
	await app.start();
} catch (error) {
	console.error(error);
}
```

### Step 7: (Optional) Add Database Migrations

If your module requires new tables, create a migration file in `resources/databases/main/migrations/` following the
naming pattern `<module>_<timestamp>.sql`:

```sql
-- resources/databases/main/migrations/custom_2608220000.sql
CREATE TABLE IF NOT EXISTS custom_items
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Then execute migrations:

```bash
npm run migrations
```

---

## Key Concepts & API Reference

### Request Context (`RequestContext`)

Passed to `isAuthorized(request)` and `resolve(request, response)`:

- `request.getMethod()`: HTTP method (e.g. `'GET'`, `'POST'`).
- `request.getPath()`: URL pathname (e.g. `'/api/accounts'`).
- `request.getPayload()`: Parsed JSON payload or raw body string.
- `request.getParams()`: Route path parameters (e.g. `/api/users/:id` -> `{id: '123'}`).
- `request.getSearch()`: Parsed URL query parameters object.
- `request.getCurrentAccount()`: Authenticated `Account` entity (if authentication succeeded).
- `request.getBearerToken()`: Decoded Bearer token string from headers.
- `request.getBasicAuthorization()`: Decoded Basic Auth string (`username:password`).
- `request.onClose(callback)`: Hook called when client disconnects (useful for SSE cleanup).

### Response Context (`ResponseContext`)

Used to craft and send HTTP responses:

- `response.replyJson(statusCode, objectOrString)`: Sends a JSON response.
- `response.replyError(statusCode, errorCode, message)`: Sends a standardized error JSON (`{error, message, status}`).
- `response.replyNoContent()`: Sends a `204 No Content` response.
- `response.reply(statusCode, contentType, body)`: Sends a custom content-type response.
- `response.replyFile(statusCode, contentType, filePath)`: Streams a file to the response.
- `response.redirect(path)`: Performs a `302 Found` redirect.
- `response.createEventStream(headers)`: Initializes and returns an `EventStream` instance for Server-Sent Events (SSE).

### Routing Patterns

Routes defined in `Handler.ROUTE` support:

- Exact path matching: `'/api/accounts'`
- Named parameters: `'/api/accounts/:id'` (accessible via `request.getParams().id`)
- Wildcards: `'/static/*'`

---

## License

This project is licensed under the **Apache License**. See `package.json` for details.
