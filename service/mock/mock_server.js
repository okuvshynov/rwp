// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const fs = require('fs');
const http = require('http');
const port = 3031;


const config = JSON.parse(fs.readFileSync('service/mock/mock_task.json', 'utf8'));
const src = fs.readFileSync('service/mock/mock_src.asm', 'utf8');
config["source"] = src;

const handler = (request, response) => {
  console.log(request.url);
  if (request.url == '/task') {
    response.end(JSON.stringify(config));
    return;
  }
  if (request.url == '/task_done') {
    let data = '';
    request.on('data', d => {
      data += d;
    })
    request.on('end', () => {
      console.log(data);
    })
    response.end();
    return;
  }

  response.end();
}

const server = http.createServer(handler);

server.listen(port, (err) => {
  if (err) {
    return console.log('error: ', err);
  }
  
  console.log(`listening on ${port}`);
});
