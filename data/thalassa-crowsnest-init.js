var Crowsnest   = require('thalassa-crowsnest')
  , Hapi          = require('thalassa-crowsnest/node_modules/hapi')
  , shoe          = require('thalassa-crowsnest/node_modules/shoe')
  , util          = require('util')
  , path          = require('path')
  , defaultLogger = require('thalassa-crowsnest/lib/defaultLogger')
  ;

module.exports = function (argv) {

var publicHtmlDir       = path.resolve(__dirname, 'node_modules/thalassa-crowsnest/public');
var publicHtmlIndexPath = path.resolve(publicHtmlDir, 'index.html');

var log = argv.log = defaultLogger( (argv.debug == true) ? 'debug' : 'error' );
var crowsnest = new Crowsnest(argv);
var server = Hapi.createServer(argv.host, argv.port);

// anything at the top level goes to index.html
server.route({ method: 'GET', path: '/{p}',       handler: { file:      { path: publicHtmlIndexPath }}});
server.route({ method: 'GET', path: '/pools/{p}', handler: { file:      { path: publicHtmlIndexPath }}});
server.route({ method: 'GET', path: '/{path*}',   handler: { directory: { path: publicHtmlDir, listing: false, index: true }}});

var sock = shoe();
sock.install(server.listener, '/aqueductStreams');
sock.on('connection', function (stream) {
  var s = crowsnest.createMuxStream();
  stream.pipe(s).pipe(stream);

  stream.on('end', function () {
    s.destroy();
  })

});

sock.on('log', function (severity, msg) {
  log(severity, msg);
})


return {
    server : server,
    log    : log
};

};

