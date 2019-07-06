// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

/*
 * This is an 'executor' which 'executes' any config
 * and returns some numbers for the events requested
 */
const axios = require('axios');

function try_dequeue() {
  axios({
    method: 'get',
    url: 'http://127.0.0.1:3031/tasks/',
  })
    .then(res => {
      res.data.forEach(task => {
        console.log('processing...');
        let i = 1001;
        let events = task.perf_events.split(',').reduce((res, key) => {
          res[key] = i++;
          return res;
        }, {});
        axios({
          method: 'post',
          url: 'http://127.0.0.1:3031/task_done/',
          data: {
            perf_events: events,
            run_uuid: task.run_uuid,
          },
        });
      });
    })
    .catch(err => {
      if (err) {
        console.error('error querying for tasks; will retry');
      }
    });
}

try_dequeue();
setInterval(try_dequeue, 200);
