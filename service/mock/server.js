const fs = require('fs');
const http = require('http');
const port = 3030;


const content = fs.readFileSync('service/mock/mock_task.json', 'utf8');

const handler = (request, response) => {
  console.log(request.url);
  if (request.url == '/task') {
    response.end(content);
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
