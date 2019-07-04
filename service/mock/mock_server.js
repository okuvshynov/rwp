// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const fs = require('fs');
const port = 3031;
const express = require('express');
const bodyParser = require('body-parser');

const config =
  JSON.parse(fs.readFileSync('service/mock/mock_task.json', 'utf8'));
const src = fs.readFileSync('service/mock/mock_src.asm', 'utf8');
config['source'] = src;

const app = express();
app.use(bodyParser.json());

app.get('/task', (req, res) => {
  res.send(JSON.stringify(config));
});

app.post('/task_done', (req, res, next) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`listening on ${port}`));
