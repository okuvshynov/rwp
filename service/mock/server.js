const fs = require('fs');
const http = require('http');
const port = 3030;


const config = JSON.parse(fs.readFileSync('service/mock/mock_task.json', 'utf8'));
const src = fs.readFileSync('service/mock/mock_src.asm', 'utf8');
config["source"] = src;

const handler = (request, response) => {
  console.log(request.url);
  if (request.url == '/task') {
    response.end(JSON.stringify(config));
  } else {
    response.end();
  }
}

const server = http.createServer(handler);

server.listen(port, (err) => {
  if (err) {
    return console.log('error: ', err);
  }
  
  console.log(`listening on ${port}`);
});
