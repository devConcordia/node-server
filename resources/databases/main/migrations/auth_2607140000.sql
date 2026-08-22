
create table if not exists auth_accounts (
    id integer primary key,
    email text not null unique,
    name text not null,
    password_hash text not null,
    created_at datetime default CURRENT_TIMESTAMP,
    updated_at datetime default CURRENT_TIMESTAMP
);

create table if not exists auth_roles (
    id integer primary key,
    name text not null unique,
    description text
);

create table if not exists auth_permissions (
    id integer primary key,
    name text not null unique,
    description text
);

-- accounts x roles (N:N)
create table if not exists auth_accounts_roles (
    account_id integer not null,
    role_id integer not null,
    primary key (account_id, role_id),
    foreign key (account_id) references auth_accounts(id) on delete cascade,
    foreign key (role_id) references auth_roles(id) on delete cascade
);

-- roles x permissions (N:N)
create table if not exists auth_roles_permissions (
    role_id integer not null,
    permission_id integer not null,
    primary key (role_id, permission_id),
    foreign key (role_id) references auth_roles(id) on delete cascade,
    foreign key (permission_id) references auth_permissions(id) on delete cascade
);
