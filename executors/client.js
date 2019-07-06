// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const axios = require('axios');
const NASMBuilder = require('./build/NASMBuilder.js');
const perf_stat_runner = require('./run/perf_stat_runner.js');

/*
 * Queries the service, gets a task, runs it and queries the server again;
 * The reason why we use this model instead of service just calling
 * executor as another service is to support executors which might be
 * not accessible from the outside.
 */
function try_dequeue() {
  console.log('checking for active tasks...');
  axios({
    method: 'get',
    url: 'http://127.0.0.1:3031/tasks/',
  }).then(
    res => {
      res.data.forEach(async (task) => {
        console.log('compiling...');
        const exe = await NASMBuilder.build('/tmp', task.source, ['-felf64']);
        console.log('executing...');
        const events = perf_stat_runner.run(exe, task.perf_events);
        axios({
          method: 'post',
          url: 'http://127.0.0.1:3031/task_done/',
          data: {
            perf_events: events,
            run_uuid: task.run_uuid,
          },
        });
      });
    }
  ) 
  .catch(err => {
    if (err) {
      // TODO: return error to service, if it was build error
      console.error(err);
    }
  });
}

setInterval(try_dequeue, 100);

