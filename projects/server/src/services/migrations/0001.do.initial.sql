BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------
-- Users --
-----------

CREATE TYPE PERMISSION AS ENUM (
    'system_user',      -- For other serivces, can do things like create/read/update jobs
    'manage_users',     -- Add/remove users and give them permissions
    'manage_projects',  -- Create/Remove projects
    'manage_feeds'   -- Create/Remove feeds
);

CREATE TABLE users (
    id           UUID PRIMARY KEY,
    username     TEXT NOT NULL,
    display_name TEXT NOT NULL,
    password     TEXT NOT NULL,
    settings     JSONB NOT NULL
);

CREATE UNIQUE INDEX ON users(username);

CREATE TABLE user_permissions (
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    permission PERMISSION NOT NULL,
    PRIMARY KEY(user_id, permission)
);

-------------
-- Project --
-------------

CREATE TABLE projects (
    id         UUID PRIMARY KEY,
    title       TEXT NOT NULL,
    image      TEXT NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE USER_ACCESS_LEVEL AS ENUM ('read', 'write', 'admin');

CREATE TABLE user_projects (
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    access_level USER_ACCESS_LEVEL NOT NULL,
    PRIMARY KEY (user_id, project_id)
);

COMMIT;