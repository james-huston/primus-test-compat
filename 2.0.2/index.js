
var express = require('express');
var Primus = require('primus');
var debug = require('debug')('testserver');
var http = require('http');
var proxiedHttp = require('proxywrap').proxy(http, {strict: false});
var app = express();
var server = module.exports = proxiedHttp.createServer(app);

// app.use(express.logger());
// app.use(express.directory(__dirname + '/test'));

// var options = {
//   origin: '*'
// };
// app.use(require('express-cors-options')(options));

app.use('/', express.static(__dirname + '/../test'));

/*
 * Errors!
 */
app.use(function (req, res) {
  res.jsonp({error: 'Invalid request'});
});

var primus = new Primus(
  server,
  {
    transformer: 'engine.io',
    parser: 'json'
  }
);


var echoMessage = function (socket, data) {
  debug('new data', data);
  data.direction = 'out';
  socket.write(data);
};

primus.on('connection', function (socket) {
  debug('client connect', socket.id);

  socket.on('data', function (data) {
    echoMessage(socket, data);
  });
});

primus.on('disconnection', function (socket) {
  debug('client disconnect', socket.id);
});

var port = process.env.PORT || 3000;
server.listen(port, function (err) {
  if (err) {
    throw err;
  }

  console.log('Server listening on ' + port);
});
