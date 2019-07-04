const axios = require('axios');
const fs = require('fs');

const src = fs.readFileSync('service/mock/mock_src.asm', 'utf8');

function new_task() {
  axios({
    method: 'post',
    url: 'http://127.0.0.1:3031/new_task/',
    data: {
      perf_events: 'cycles,r0803',
      source: src,
    },
  });
}

new_task();

