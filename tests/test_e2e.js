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


const expect = require('chai').expect;
const { fork } = require('child_process');
const MockUIClient = require('./MockUIClient.js');

describe('RWP E2E', function() {
  this.timeout(5000);
  it('mock ui, real server, mock executor', async() => {
    // First, start the real server
    const server = fork('service/app.js');

    // Start the executor, which will periodically poll for jobs
    const executor = fork('service/mock/mock_executor.js');

    setTimeout(async() => {
      const client = new MockUIClient();
      const task_id = await client.new_task();
      setTimeout(async() => {
        const result = await client.task_status(task_id);
        console.log(result);
        expect(result).to.equal('123');
        executor.kill('SIGINT');
        server.kill('SIGINT');
      }, 2000);
    }, 2000);
  });
});

