// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const http = require('http');

const port = 3031;

/*
 * List of functionality we need to implement:
 * User facing:
 *  - submit new job
 *  - monitor for job completion, see results
 *  - check other jobs (including docs)
 * Executor-facing:
 *  - executor status reporting
 *  - executor task queue
 */

const handle_pick_task = (req, res) => {
  console.log('executor checks if there\'re any tasks');
  res.end();
}

const handle_task_done = (req, res) => {
  console.log('executor reports on completed task results');
  res.end();
}

const handle_index = (req, res) => {
  console.log('index.html');
  res.end();
}

const handle_submit_task = (req, res) => {
  console.log('user submits new task');
  res.end();
}

const default_handler = (req, res) => {
  console.log('404');
  res.end();
}

const handler_map = {
  '/pick_task' : handle_pick_task,
  '/task_done' : handle_task_done,
  '/' : handle_index,
  '/submit_task' : handle_submit_task
};

const handler = (request, response) => {
  console.log(request.url);
  handler_impl = handler_map[request.url] || default_handler;
  handler_impl(request, response);
}

const server = http.createServer(handler);

server.listen(port, (err) => {
  if (err) {
    return console.log('error: ', err);
  }
  
  console.log(`listening on ${port}`);
});
