const axios = require('axios');
const fs = require('fs');

process.on('uncaughtException', (err) => {
  console.log(err);
});

const src = fs.readFileSync('tests/mock/mock_src.asm', 'utf8');

class MockUIClient {
  async new_task(events) {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3031/new_task/',
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
      url: 'http://127.0.0.1:3031/task_status/',
      params: {
        uuid: task_uuid,
      },
    });
    return res.data;
  }
}

module.exports = MockUIClient;
