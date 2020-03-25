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

--------------
-- Datasets --
--------------

CREATE TYPE DATASET_TYPE AS ENUM (
    'empty',
    'immutable',
    'workspace',
    'feed',
    'scrape'
);

CREATE TABLE datasets (
    id    UUID PRIMARY KEY,
    title TEXT NOT NULL,
    type  DATASET_TYPE NOT NULL,
    image TEXT NOT NULL
);

CREATE TABLE user_datasets(
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
    access_level USER_ACCESS_LEVEL NOT NULL,
    PRIMARY KEY (user_id, dataset_id)
);

CREATE TABLE blobs (
    id              TEXT PRIMARY KEY,
    mime            TEXT NOT NULL,
    object_location TEXT NOT NULL,
    blob_data       JSONB NOT NULL
);

CREATE TYPE FILE_TYPE AS ENUM (
    'label',
    'directory',
    'blob',
    'timeline', 
    'link'
);

CREATE TABLE files (
    dataset_id  UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
    path        TEXT NOT NULL,
    added_on    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type        FILE_TYPE NOT NULL,

    -- Workspace presentation information
    x      INTEGER,
    y      INTEGER,
    width  INTEGER,
    height INTEGER,

    -- Parent path for quick lookup
    parent_path TEXT NOT NULL,
    FOREIGN KEY (dataset_id, parent_path) REFERENCES files(dataset_id, path) ON DELETE CASCADE,

    -- Non-directories can have one of the following
    blob_id     TEXT REFERENCES blobs(id) ON DELETE CASCADE,

    timeline_id UUID REFERENCES projects(id) ON DELETE CASCADE,

    linked_file_dataset_id UUID,
    linked_file_path TEXT,

    FOREIGN KEY (linked_file_dataset_id, linked_file_path) REFERENCES files(dataset_id, path) ON DELETE CASCADE,

    PRIMARY KEY (dataset_id, path)
);

CREATE TYPE EXTRACTOR_JOB_STATUS AS ENUM (
    'waiting',
    'locked',
    'failed',
    'complete'
);

CREATE TABLE extractor_jobs (
    id           UUID PRIMARY KEY,
    job_name     TEXT NOT NULL,
    added_on     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status       EXTRACTOR_JOB_STATUS NOT NULL DEFAULT 'waiting',
    processed_on TIMESTAMPTZ
);

CREATE INDEX ON files(dataset_id, added_on);

-------------
-- Project --
-------------

CREATE TABLE projects (
    id         UUID PRIMARY KEY,
    title      TEXT NOT NULL,
    image      TEXT NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL
);

CREATE TYPE USER_ACCESS_LEVEL AS ENUM ('read', 'write', 'admin');

CREATE TABLE user_projects (
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    access_level USER_ACCESS_LEVEL NOT NULL,
    PRIMARY KEY (user_id, project_id)
);

COMMIT;