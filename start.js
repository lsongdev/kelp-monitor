const fs = require('fs');
const http = require('http');
const EventSource = require('server-send-events');
const CpuCollector = require('./cpu');
const pkg = require('./package.json');

const send = res =>
  fs.createReadStream(__dirname + '/monitor.html').pipe(res);

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
  console.log(`[${pkg.name}@${pkg.version}] listening on port http://localhost:${port}`);

  const cpuInspector = new CpuCollector();

  setInterval(() => {
    es.send({
      cpu: cpuInspector.ratio(),
      memory: process.memoryUsage(),
    });
  }, 2000);

});