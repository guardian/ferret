BEGIN;

CREATE TABLE feeds (
    id         UUID PRIMARY KEY,
    title      TEXT NOT NULL,
    type       TEXT NOT NULL,
    frequency  TEXT NOT NULL,
    parameters JSONB NOT NULL,
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    created_on TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_feeds (
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    feed_id      UUID REFERENCES feeds(id) ON DELETE CASCADE NOT NULL,
    access_level USER_ACCESS_LEVEL NOT NULL,
    PRIMARY KEY (user_id, feed_id)
);

CREATE TYPE JOB_STATUS AS ENUM  ('ready', 'processing', 'done', 'timeout', 'failed');

CREATE TABLE feed_jobs (
    id                UUID PRIMARY KEY,
    feed_id           UUID REFERENCES feeds(id) ON DELETE CASCADE NOT NULL,
    start_on          TIMESTAMPTZ NOT NULL,
    run_on            TIMESTAMPTZ NOT NULL,
    last_heartbeat_on TIMESTAMPTZ,
    status            JOB_STATUS NOT NULL
);

CREATE INDEX ready_jobs ON feed_jobs(status) WHERE status = 'ready';

COMMIT;