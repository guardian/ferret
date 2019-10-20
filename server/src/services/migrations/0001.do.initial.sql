-----------
-- Users --
-----------

CREATE TYPE PERMISSION AS ENUM (
    'system_user'       -- For other serivces, can do things like create/read/update jobs
    'manage_users',     -- Add/remove users and give them permissions
    'manage_projects',  -- Create/Remove projects
    'manage_monitors'   -- Create/Remove monitors
);

CREATE TABLE users (
    id                TEXT PRIMARY KEY,
    username          TEXT NOT NULL,
    display_name      TEXT NOT NULL,
    password          TEXT NOT NULL,
    settings          JSONB NOT NULL
);

CREATE UNIQUE INDEX ON users(username);

CREATE TABLE user_permissions (
    user_id    TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    permission PERMISSION NOT NULL,
    PRIMARY KEY(user_id, permission)
);

-------------
-- Project --
-------------

CREATE TABLE projects (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    image      TEXT NOT NULL,
    created_by TEXT REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE USER_ACCESS_LEVEL AS ENUM ('read', 'write', 'admin');

CREATE TABLE user_projects (
    user_id      TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_id   TEXT REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    access_level USER_ACCESS_LEVEL NOT NULL,
    PRIMARY KEY (user_id, project_id)
);

---------------
-- Timelines --
---------------

CREATE TABLE timelines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_by TEXT REFERENCES users(id),
    created_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE timeline_events (
    id           TEXT PRIMARY KEY,
    timeline_id  TEXT REFERENCES timelines(id) ON DELETE CASCADE NOT NULL,
    beginning_on TIMESTAMPTZ NOT NULL,
    ending_on    TIMESTAMPTZ,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL
);

CREATE INDEX ON timeline_events(timeline_id);

CREATE TYPE USER_ACCESS_LEVEL AS ENUM ('grid_image', 'tweet');

CREATE TABLE timeline_events_evidence (
    event_id TEXT REFERENCES timeline_events(id) ON CASCADE DELETE NOT NULL,
    type     EVIDENCE_TYPE NOT NULL,
    data     JSONB NOT NULL    
);

CREATE INDEX ON timeline_events_evidence(event_id)

--------------
-- Monitors --
--------------

CREATE TABLE monitors (
    id           TEXT PRIMARY KEY,
    project_id   TEXT REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    name         TEXT NOT NULL,
    query        TEXT NOT NULL,
    updated_on   TIMESTAMPTZ,
    since_id     TEXT 
);

CREATE TYPE JOB_TYPE AS ENUM (
    'twitter::update',   -- Moving forward
    'twitter::backfill', -- Reading the back cataloge for a twitter query, this is seperate due to API limits
    'grid'               -- Poll grid for data
);

CREATE TYPE JOB_STATUS AS ENUM  ('ready', 'done', 'failed');

CREATE TABLE jobs (
    id           TEXT PRIMARY KEY,
    monitor_id   TEXT REFERENCES monitors(id) ON DELETE CASCADE NOT NULL,
    job_type     TEXT NOT NULL,
    submitted_on TIMESTAMPTZ NOT NULL,
    execute_on   TIMESTAMPTZ NOT NULL,
    parameters   JSONB NOT NULL,
    status       JOB_STATUS NOT NULL
);

CREATE INDEX ready_jobs ON jobs(status) WHERE status = 'ready';

------------------
-- Data::Tweets --
------------------

CREATE TABLE tweets (
    id    TEXT PRIMARY KEY,
    tweet JSONB NOT NULL
);

CREATE TABLE job_tweets (
    job_id     TEXT REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    tweet_id   TEXT REFERENCES tweets(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY(job_id, tweet_id)
);

CREATE INDEX ON job_tweets(job_id);
CREATE INDEX ON job_tweets(tweet_id);

----------------
-- Data::Grid --
----------------

CREATE TABLE grid_images (
    id   TEXT PRIMARY KEY,
    data JSONB NOT NULL
);

CREATE TABLE job_grid_images(
    job_id        TEXT REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    grid_image_id TEXT REFERENCES grid_images(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY(job_id, grid_image_id)
);

CREATE INDEX ON job_grid_images(job_id);
CREATE INDEX ON job_grid_images(grid_image_id);

--------------------
-- Archived Media --
--------------------

CREATE TABLE media (
    id           TEXT PRIMARY KEY,
    mime_type    TEXT NOT NULL,
    s3_location  TEXT NOT NULL
);

-- avoid having to rewrite URLs inside data bodies 
CREATE TABLE media_references (
    id           TEXT REFERENCES media(id) ON DELETE CASCADE NOT NULL,
    original_url TEXT NOT NULL
);

CREATE INDEX ON media_references(original_url);
