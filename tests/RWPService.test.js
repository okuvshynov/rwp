// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const { fork } = require('child_process');
const MockUIClient = require('./MockUIClient.js');

/*
 * This test uses mock executor and ui, but real
 * server and db
 */

test('testing server interfaces', done => {
  expect.assertions(3);
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
      const task_id = await client.new_task('cycles,r0803');
      setTimeout(async() => {
        const result = await client.task_status(task_id);
        expect(result).toHaveLength(1);
        const perf_events = result[0].perf_events;
        expect(perf_events).toBeDefined();
        const counters = JSON.parse(perf_events);
        expect(counters).toEqual(expect.objectContaining({
          cycles: expect.any(Number),
          r0803: expect.any(Number),
        }));
        executor.kill('SIGINT');
        server.kill('SIGINT');
        done();
      }, 1000);
    }, 1000);
  }, 1000);
});

/*
 * This test uses real executor, server and db.
 * TODO: figure out how to limit test by environment;
 */
test('testing server interfaces', done => {
  expect.assertions(3);
  process.on('uncaughtException', (err) => {
    console.log(err);
  });
  // First, start the real server
  const server = fork('service/app.js');

  // Start the executor, which will periodically poll for jobs
  setTimeout(async() => {
    const executor = fork('executors/client.js');

    setTimeout(async() => {
      const client = new MockUIClient();
      const task_id = await client.new_task('cycles,r0803');
      setTimeout(async() => {
        const result = await client.task_status(task_id);
        expect(result).toHaveLength(1);

        const perf_events = result[0].perf_events;
        expect(perf_events).toBeDefined();

        const counters = JSON.parse(perf_events);
        expect(counters).toEqual(expect.objectContaining({
          cycles: expect.any(Number),
          r0803: expect.any(Number),
        }));
        executor.kill('SIGINT');
        server.kill('SIGINT');
        done();
      }, 1000);
    }, 1000);
  }, 1000);
});
