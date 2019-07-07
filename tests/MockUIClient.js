const axios = require('axios');
const fs = require('fs');
const url = require('url');

const argv = require('yargs')
  .default('service_url', 'http://127.0.0.1:3031/')
  .argv
;

process.on('uncaughtException', (err) => {
  console.log(err);
});

const src = fs.readFileSync('tests/mock/mock_src.asm', 'utf8');

class MockUIClient {
  async new_task(events) {
    const res = await axios({
      method: 'post',
      url: url.resolve(argv.service_url, '/new_task/'),
      data: {
        perf_events: events,
        source: src,
      },
    });
    return res.data;
  }

  async task_status(task_uuid) {
    const res = await axios({
      method: 'get',
      url: url.resolve(argv.service_url, '/task_status/'),
      params: {
        uuid: task_uuid,
      },
    });
    return res.data;
  }
}

module.exports = MockUIClient;
