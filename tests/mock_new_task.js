const MockUIClient = require('./MockUIClient.js');

const client = new MockUIClient();

client.new_task().then(
  task_id => {
    console.log(task_id);
  }
);
