// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const express = require('express');
const bodyParser = require('body-parser');
const DBSQLite = require('./db_sqlite.js');

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
  await db.new_task(JSON.stringify(req.body));
  res.sendStatus(200);
});

app.get('/task', async(req, res) => {
  console.log('/task');
  await db.connect();
  const task = await db.dequeue();
  if (task === undefined) {
    // TODO: is that really 200?
    res.sendStatus(200);
  } else {
    // TODO: also send uuid
    res.send(task.task_config);
  }
});

app.post('/task_done', async(req, res, next) => {
  console.log('/task_done');
  console.log(req.body);
  await db.connect();
  // TODO: pass run_uuid around
  await db.record_task_result('123221', req.body);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`listening on ${port}`));
