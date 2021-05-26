CREATE TABLE IF NOT EXISTS device_tokens (
        ID UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        TOKEN TEXT NOT NULL
);