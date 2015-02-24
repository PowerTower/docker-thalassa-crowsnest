var opts = {
    host            : '0.0.0.0',
    port            : 8080,
    thalassaHost    : process.env['THALASSA_SERVER_PORT_5001_TCP_ADDR'],
    thalassaPort    : parseInt(process.env['THALASSA_SERVER_PORT_5001_TCP_PORT']),
    thalassaApiPort : parseInt(process.env['THALASSA_SERVER_PORT_9000_TCP_PORT']),
    dbPath          : '/data/thalassa-crowsnest/db',
    debug           : process.env['DEBUG'] === true ? true : false
};

var thalassaCrowsnest = require('./thalassa-crowsnest-init.js')(opts);

thalassaCrowsnest.server.start(function () {
  thalassaCrowsnest.log('info', util.format("Thalassa Crowsnest listening on %s:%s", opts.host, opts.port));
});
