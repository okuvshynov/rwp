// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const express = require('express');
const bodyParser = require('body-parser');
const DBSQLite = require('./db/DBSQLite.js');
const path = require('path');

const argv = require('yargs')
  .default('port', 3031)
  .argv
;

// TODO: current db is for 1 session only
const db = new DBSQLite(':memory:');
const port = argv.port;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/monaco-editor', express.static("node_modules/monaco-editor"));

app.get('/', async(req, res) => {
  res.sendFile(path.join(__dirname, 'ui/index.html'));
}); 

app.get('/diff', async(req, res) => {
  res.sendFile(path.join(__dirname, 'ui/diff.html'));
}); 

app.get('/status', async(req, res) => {
  await db.connect();
  const cnt = await db.tasks_in_queue();
  res.send({
    in_queue: cnt["in_queue"],
  })
});

// Handles new task submission
app.post('/new_task', async(req, res, next) => {
  await db.connect();
  // TODO: back and forth to/from JSON :/
  const task_uuid = await db.new_task(JSON.stringify(req.body));
  res.send(task_uuid);
});

app.get('/task_status', async(req, res) => {
  await db.connect();
  const task = await db.get_task_result(req.query.uuid);
  if (task === undefined) {
    res.send([]);
  } else {
    res.send([{
      status: task.status,
      perf_events: task.result,
    }]);
  }
});

app.get('/tasks', async(req, res) => {
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
  await db.connect();
  // TODO: another stringify
  await db.record_task_result(
    req.body.run_uuid, JSON.stringify(req.body.perf_events)
  );
  res.sendStatus(200);
});

app.listen(port, () => console.log(`listening on ${port}`));
