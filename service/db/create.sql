-- MIT License
-- Refer to /LICENSE file for full text
-- Copyright (c) 2019 Oleksandr Kuvshynov


-- Status can mean
-- * 0 - newly created, not picked up
-- * 1 - picked up by executor
-- * 2 - finished
CREATE TABLE IF NOT EXISTS tasks(
  id INTEGER PRIMARY KEY ASC,
  task_config TEXT,
  status INTEGER,
  run_uuid TEXT
);
CREATE INDEX IF NOT EXISTS task_status_idx ON tasks(status);

CREATE TABLE IF NOT EXISTS results(
  id INTEGER PRIMARY KEY ASC,
  task_id INTEGER,
  FOREIGN KEY(task_id) REFERENCES tasks(id)
);

-- This is 'cached' version to show in UI
CREATE TABLE IF NOT EXISTS executors(
  id INTEGER,
  type TEXT
);

