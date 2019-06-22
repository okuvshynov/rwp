const http = require('http')
const nasm_builder = require('./build/nasm_builder.js')
const perf_stat_runner = require('./run/perf_stat_runner.js')

const options = {
  hostname: '127.0.0.1',
  port : 3030,
  path : '/task',
  method : 'GET'
}

const req = http.request(options, res => {
  var query = '';

  res.on('data', d => {
    query += d;
  });

  res.on('end', () => {
    var config = JSON.parse(query);
    console.log(config);
    const exe = nasm_builder.build('/tmp', config.source, ['-felf64']);
    perf_stat_runner.run(exe, config.perf_events);
  })
});

req.end();
