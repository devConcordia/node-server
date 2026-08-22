CREATE TABLE ops_migrations (  id integer primary key autoincrement,  filename text unique not null,  checksum text not null,  executed_at datetime default current_timestamp );

CREATE TABLE auth_accounts (
    id integer primary key,
    email text not null unique,
    name text not null,
    password_hash text not null,
    created_at datetime default CURRENT_TIMESTAMP,
    updated_at datetime default CURRENT_TIMESTAMP
, status text default 'active');

CREATE TABLE auth_roles (
    id integer primary key,
    name text not null unique,
    description text
);

CREATE TABLE auth_permissions (
    id integer primary key,
    name text not null unique,
    description text
);

CREATE TABLE auth_accounts_roles (
    account_id integer not null,
    role_id integer not null,
    primary key (account_id, role_id),
    foreign key (account_id) references auth_accounts(id) on delete cascade,
    foreign key (role_id) references auth_roles(id) on delete cascade
);

CREATE TABLE auth_roles_permissions (
    role_id integer not null,
    permission_id integer not null,
    primary key (role_id, permission_id),
    foreign key (role_id) references auth_roles(id) on delete cascade,
    foreign key (permission_id) references auth_permissions(id) on delete cascade
);