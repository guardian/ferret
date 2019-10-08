CREATE TYPE USER_LEVEL AS ENUM ('read', 'write', 'admin');

CREATE TABLE users (
    id                TEXT PRIMARY KEY,
    username          TEXT NOT NULL,
    display_name      TEXT NOT NULL,
    level             USER_LEVEL NOT NULL,
    password          TEXT NOT NULL,
    totp_secret       TEXT,
    invalidation_time BIGINT
);

CREATE TABLE projects (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    image      TEXT NOT NULL,
    created_by TEXT, -- REFERENCES users(id) ON DELETE RESTRICT NOT NULL,

    created_on TIMESTAMPTZ NOT NULL
);

CREATE TABLE monitors (
    id         TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    name       TEXT NOT NULL,
    query      TEXT NOT NULL
);

CREATE TABLE tweets (
    monitor_id TEXT REFERENCES monitors(id) ON DELETE CASCADE NOT NULL,
    full_tweet JSONB NOT NULL
);