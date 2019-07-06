// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

/*
 * I'm not yet sure about the best way to do this.
 * But, we need to capture interactions between 3 entities:
 * - server
 * - executor(s)
 * - user(s)
 * Each of this is easy to configure, mock and run; how to do it
 * in a nice scalable way though?
 */

/*
 * In this test, we:
 *  - start real server with RAM storage config
 *  - start mock executor, so that we do not rely on
 *    specific architecture.
 *  - start ui client to get the counters we expect to provide
 *    to the mock executor.
 */

const { fork } = require('child_process');
const MockUIClient = require('./MockUIClient.js');

test('testing server interfaces', done => {
  process.on('uncaughtException', (err) => {
    console.log(err);
  });
  // First, start the real server
  const server = fork('service/app.js');

  // Start the executor, which will periodically poll for jobs
  setTimeout(async() => {
    const executor = fork('tests/mock/mock_executor.js');

    setTimeout(async() => {
      const client = new MockUIClient();
      const task_id = await client.new_task();
      setTimeout(async() => {
        const result = await client.task_status(task_id);
        expect(result).toHaveLength(1);
        const perf_events = result[0].perf_events;
        expect(perf_events).toBeDefined();
        const counters = JSON.parse(perf_events);
        console.log(counters);
        executor.kill('SIGINT');
        server.kill('SIGINT');
        done();
      }, 1000);
    }, 1000);
  }, 1000);
});
