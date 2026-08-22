-- roles
insert into auth_roles (name, description)
values
    ('MASTER', 'master user'),
    ('MANAGER', 'manager user'),
    ('COMMON', 'common user')
    on conflict (name) do nothing;

-- permissions
insert into auth_permissions (name, description)
values
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
    ('PERMISSION_DELETE', 'remove permission')
    on conflict (name) do nothing;

-- associate role x permission
insert into auth_roles_permissions (role_id, permission_id)
select r.id, p.id
from auth_roles r
         cross join auth_permissions p
where r.name = 'MASTER'
    on conflict (role_id, permission_id) do nothing;
