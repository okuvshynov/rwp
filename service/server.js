// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const http = require('http');

const handle_pick_task = (db, req, res) => {
  console.log('executor checks if there\'re any tasks');
  res.end();
};

const handle_task_done = (db, req, res) => {
  console.log('executor reports on completed task results');
  res.end();
};

const handle_index = (db, req, res) => {
  console.log('index.html');
  res.end();
};

const handle_submit_task = (db, req, res) => {
  console.log('user submits new task');
  res.end();
};

const default_handler = (db, req, res) => {
  console.log('404');
  res.end();
};

const handler_map = {
  '/pick_task': handle_pick_task,
  '/task_done': handle_task_done,
  '/': handle_index,
  '/submit_task': handle_submit_task,
};

class RWPServer {
  constructor(port, db) {
    this.db = db;
    this.port = port;
    this.server = http.createServer((request, response) => {
      console.log(request.url);
      var handler_impl = handler_map[request.url] || default_handler;
      handler_impl(this.db, request, response);
    });
  }

  serve() {
    this.server.listen(this.port, (err) => {
      if (err) {
        return console.log('error: ', err);
      }
      console.log(`listening on ${this.port}`);
    });
  }
};

module.exports = RWPServer;

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

