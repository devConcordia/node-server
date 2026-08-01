
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



-- roles
insert into auth_roles (name, description) values
    ('MASTER', 'master user'),
    ('MANAGER', 'manager user'),
    ('COMMON', 'common user');

-- permissions
insert into auth_permissions (name, description) values
    ('ACCOUNT_CREATE', 'create account'),
    ('ACCOUNT_READ', 'view account'),
    ('ACCOUNT_UPDATE', 'edit account'),
    ('ACCOUNT_DELETE', 'remove account'),

    ('ROLE_CREATE', 'create role'),
    ('ROLE_READ', 'view role'),
    ('ROLE_UPDATE', 'edit role'),
    ('ROLE_DELETE', 'remove role'),

    ('PERMISSION_CREATE', 'create permission'),
    ('PERMISSION_READ', 'view permission'),
    ('PERMISSION_UPDATE', 'edit permission'),
    ('PERMISSION_DELETE', 'remove permission');

-- associate role x permission
insert into auth_roles_permissions (role_id, permission_id)
select r.id, p.id
from auth_roles r
    cross join auth_permissions p
where r.name = 'MASTER';

