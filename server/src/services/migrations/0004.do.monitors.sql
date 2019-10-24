BEGIN;

CREATE TABLE monitors (
    id           UUID PRIMARY KEY,
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
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
    id           UUID PRIMARY KEY,
    monitor_id   UUID REFERENCES monitors(id) ON DELETE CASCADE NOT NULL,
    job_type     JOB_TYPE NOT NULL,
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
    job_id     UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
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
    job_id        UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
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

COMMIT;