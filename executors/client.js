// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const axios = require('axios');
const NASMBuilder = require('./build/nasm_builder.js');
const perf_stat_runner = require('./run/perf_stat_runner.js');

function send_results(to_send) {
  var post_options = {
    path: '/task_done',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': to_send.length,
    },
  };
  Object.assign(post_options, server_config);
  const post_update = http.request(post_options, post_result => {
    post_result.on('data', d => {
      // TODO: acknowledge the update
      console.log(d);
    });
  });

  post_update.on('error', e => {
    console.error(e);
  });
  post_update.write(to_send);
  post_update.end();
}

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
      console.error(err);
    }
  });
}

setInterval(try_dequeue, 5 * 1000);

