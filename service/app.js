// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const express = require('express');
const bodyParser = require('body-parser');
const DBSQLite = require('./db_sqlite.js');

/*
 * List of functionality we need to implement:
 * User facing:
 *  - see if there're executors available
 *  - submit new job
 *  - monitor for job completion, see results
 *  - check queue status
 *  - check other jobs (including docs)
 * Executor-facing:
 *  - executor status reporting
 *  - executor task dequeue
 *  - executor task done
 */


// TODO: current db is for 1 session only
const db = new DBSQLite(':memory:');
const port = 3031;

const app = express();
app.use(bodyParser.json());

// Handles new task submission
app.post('/new_task', async(req, res, next) => {
  console.log('/new_task');
  await db.connect();
  // TODO: this is idiotic
  const task_uuid = await db.new_task(JSON.stringify(req.body));
  res.send(task_uuid);
});

app.get('/task_status', async(req, res) => {
  console.log('/task_status');
  await db.connect();
  const task = await db.get_task_result(req.query.uuid);
  console.log(task);
  if (task === undefined) {
    res.send([]);
  } else {
    res.send([{
      perf_events: task.result,
    }]);
  }
});


app.get('/tasks', async(req, res) => {
  console.log('/tasks');
  await db.connect();
  const task = await db.dequeue();
  if (task === undefined) {
    res.send([]);
  } else {
    let task_config = JSON.parse(task.task_config);
    task_config.run_uuid = task.run_uuid;
    res.send([task_config]);
  }
});

app.post('/task_done', async(req, res, next) => {
  console.log('/task_done');
  await db.connect();
  // TODO: another stringify
  await db.record_task_result(
    req.body.run_uuid, JSON.stringify(req.body.perf_events)
  );
  res.sendStatus(200);
});

app.listen(port, () => console.log(`listening on ${port}`));
