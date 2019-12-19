BEGIN;

CREATE TYPE EVENT_ACTION AS ENUM  ('create', 'update', 'delete');

CREATE TABLE project_events (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ts          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    action      EVENT_ACTION NOT NULL,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_id  UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL
);

CREATE INDEX ON project_events(ts);

COMMIT;