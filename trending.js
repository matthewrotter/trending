//dependencies
var express = require('express'),
  http = require('http'),
  config = require('./config');

//create express app
var app = express();
app.config = config;

//config all
app.configure(function() {
  //settings
  app.disable('x-powered-by');
  app.set('port', config.port);
  app.set('strict routing', true);

  //middleware
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());

  var allowCrossDomain = function(req, res, next) {
    var origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
  };
  app.use(allowCrossDomain);
  app.options('/*', function(req, res) {
    res.send(200);
  });

  //error handler
  app.use(function(err, req, res, next) {
    console.warn(err);
    res.status(500);
    res.send({ error: err.message });
  });
});

app.use('/trending', express.static(__dirname + '/public'));

//create server
var server = http.createServer(app);
app.server = server;

//route requests
require('./routes')(app);

server.listen(app.get('port'), function() {
  console.log('sherpa-dash express server listening on port ' + app.get('port'));
});
