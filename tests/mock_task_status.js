const MockUIClient = require('./MockUIClient.js');

const client = new MockUIClient();

client.task_status(process.argv[2]).then(
  res => {
    console.log(res);
  }
);

