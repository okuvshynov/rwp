-- MIT License
-- Refer to /LICENSE file for full text
-- Copyright (c) 2019 Oleksandr Kuvshynov


-- Status can mean
-- * 0 - newly created, not picked up
-- * 1 - picked up by executor
-- * 2 - finished
-- * 3 - finished with error (?)
CREATE TABLE IF NOT EXISTS tasks(
  id INTEGER PRIMARY KEY ASC,
  uuid TEXT,
  task_config TEXT,
  status INTEGER,
  run_uuid TEXT,
  result TEXT
);
CREATE INDEX IF NOT EXISTS task_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS task_uuid ON tasks(uuid);
CREATE INDEX IF NOT EXISTS task_run_uuid ON tasks(run_uuid);

-- This is 'cached' version to show in UI
CREATE TABLE IF NOT EXISTS executors(
  id INTEGER,
  type TEXT
);

