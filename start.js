const fs = require('fs');
const http = require('http');
const EventSource = require('server-send-events');

const send = res =>
  fs.createReadStream('./monitor.html').pipe(res);

const es = new EventSource();
const server = http.createServer((req, res) => {
  if (es.match(req, '/usage')) {
    const client = es.handle(req, res);
    client.on('error', () => { });
  } else {
    send(res);
  }
});

const { KELP_MONITOR_PORT: port = 59757 } = process.env;
server.listen(port, () => {
  console.log(`Monitor listening on port ${port}`);

  setInterval(() => {
    es.send({
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
    });
  }, 2000);

});