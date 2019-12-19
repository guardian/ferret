CREATE TYPE DATASET_TYPE AS ENUM (
    'standard',
    'feed'
);

CREATE TABLE datasets(
    id    UUID PRIMARY KEY,
    title TEXT NOT NULL,
    type  DATASET_TYPE NOT NULL
);

CREATE TABLE user_datasets(
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (user_id, dataset_id)
);

CREATE TABLE documents (
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
    id         TEXT NOT NULL,
    added_on   TIMESTAMPTZ NOT NULL,
    document   JSONB NOT NULL,
    PRIMARY KEY(dataset_id, id)
);

CREATE INDEX ON documents(dataset_id, added_on);