// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const axios = require('axios');
const url = require('url');
const {log_maybe, log_every_ms} = require('../lib/logn.js');
const CPPBuilder = require('./build/CPPBuilder.js');
const PerfStatRunner = require('./run/PerfStatRunner.js');
const argv = require('yargs')
  .default('service_url', 'http://127.0.0.1:3031/')
  .argv
;
  

/*
 * Queries the service, gets a task, runs it and queries the server again;
 * The reason why we use this model instead of service just calling
 * executor as another service is to support executors which might be
 * not accessible from the outside.
 */
function try_dequeue() {
  axios({
    method: 'get',
    url: url.resolve(argv.service_url, '/tasks/'),
  }).then(
    res => {
      res.data.forEach(async (task) => {
        const exe = await CPPBuilder.build('/tmp', task.source, []);
        const events = PerfStatRunner.run(exe, task.perf_events);
        axios({
          method: 'post',
          url: url.resolve(argv.service_url, '/task_done/'),
          data: {
            perf_events: events,
            run_uuid: task.run_uuid,
          },
        });
      });
    }
  ) 
  .catch(err => {
    console.log(err);
    if (err) {
      // TODO: return error to service, if it was build error
      log_every_ms(5000, "error");
    }
  });
}

setInterval(try_dequeue, 100);

