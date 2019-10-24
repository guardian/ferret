BEGIN;

CREATE TABLE timelines (
    id         UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title      TEXT NOT NULL,
    image      TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    created_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE timeline_entries (
    id          UUID PRIMARY KEY,
    timeline_id UUID REFERENCES timelines(id) ON DELETE CASCADE NOT NULL,
    index       INT NOT NULL,
    happened_on TIMESTAMPTZ,
    title       TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE INDEX ON timeline_entries(timeline_id);

CREATE TABLE timeline_entry_evidence (
    entry_id UUID REFERENCES timeline_entries(id) ON DELETE CASCADE NOT NULL,
    type     TEXT NOT NULL,
    title    TEXT NOT NULL,
    data     JSONB NOT NULL    
);

CREATE INDEX ON timeline_entry_evidence(entry_id);

COMMIT;