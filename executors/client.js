const http = require('http')
const nasm_builder = require('./build/nasm_builder.js')
const perf_stat_runner = require('./run/perf_stat_runner.js')

const server_config = {
  hostname: '127.0.0.1',
  port : 3031,
}

function send_results(to_send) {
  var post_options = {
    path : '/task_done',
    method : 'POST',
    headers : {
      'Content-Type': 'application/json',
      'Content-Length': to_send.length
    }
  }
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
function ask_for_tasks() {
  var poll_options = {
    path : '/task',
    method : 'GET'
  }
  Object.assign(poll_options, server_config);

  const req = http.request(poll_options, res => {
    var query = '';

    res.on('data', d => {
      query += d;
    });

    res.on('error', e => {
      console.error(e);
    });

    res.on('end', () => {
      var config = JSON.parse(query);
      const exe = nasm_builder.build('/tmp', config.source, ['-felf64']);
      const event_counts = perf_stat_runner.run(exe, config.perf_events);
      const to_send = JSON.stringify({
        'key': config.key,
        'perf_events' : event_counts
      });

      send_results(to_send);
    });
  });

  req.end();
}

ask_for_tasks();