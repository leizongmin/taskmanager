/**
 * taskmanager
 *
 * @author 老雷<leizongmin@gmail.com>
 */

/*
 启动参数：  [监听端口]
*/ 

var quickweb = require('quickweb-base');
var mvc = require('quickweb-mvc');
var logger = require('./logger');
var http = require('http');
var path = require('path');
var fs = require('fs');
var io = require('socket.io');

var app = quickweb();

logger.info('Init...');

// 屏蔽favicon
app.use(function (req, res, next) {
  if (req.filename === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  }
  else
    return next();
});

// 自动载入code目录的API程序
var list = fs.readdirSync(path.resolve(__dirname, 'code'));
list.forEach(function (f) {
  f = path.resolve(__dirname, 'code', f);
  require(f)(app.route, app);
  logger.info('Load %s', f);
});

// 自动载入app目录的MVC应用
var list = fs.readdirSync(path.resolve(__dirname, 'app'));
list.forEach(function (n) {
  f = path.resolve(__dirname, 'app', n);
  var prefix = '/app/' + n;
  var m = mvc.middleware({path: f, prefix: prefix, debug: true});
  app.use(prefix, m);
  logger.info('Load %s', f);
});

// 资源文件
app.onNotFound = function (req, res, next) {
  logger.log('http from %s %s %s', req.connection.remoteAddress, req.method, req.filename);
  var basedir = path.resolve(__dirname, '../public');
  var filename = path.resolve(basedir, req.filename.substr(1));
  if (filename.substr(0, basedir.length) !== basedir)
    return res.sendError(403, 'Access Denied!');
  try {
    fs.stat(filename, function (err, stats) {
      if (err)
        return res.sendError(404, 'Not found!');
      if (stats.isDirectory()) {
        if (req.filename.substr(-1) !== '/')
          req.filename += '/';
        req.filename = req.filename + 'index.html';
        return app.onNotFound(req, res, next);
      }
      return res.sendStaticFile(filename);
    });
  }
  catch (err) {
    return res.sendError(404, 'Not found!');
  }
};

// 验证权限
app.use('/admin/', function (req, res, next) {
  if (req.basicAuth && req.basicAuth.username === 'admin' && req.basicAuth.password === 'admin')
    return next();
  else
    return res.authFail('Admin Login');
});

// 出错信息
app.use(function (req, res, next) {
  res._sendError = res.sendError;
  res.sendError = function (status, msg) {
    if (req.url.substr(0, 11) === '/admin/api/' && req.accepts('json'))
      res.sendJSON({error: msg.toString(), stack: msg.stack || msg.toString()});
    else
      res._sendError(status, msg);
    logger.error('http response %d %s: %s', status, req.url, msg.stack || msg.toString());
  };
  next();
});



// 启动服务器
var port = parseInt(process.argv[2]);
if (isNaN(port) || port < 1)
  port = 8860;
var server = http.createServer(app.handler()).listen(port);

logger.info('Server listen on port %d', port);


// 启动在线日志监控
var ioClientKeys = [];
app.route.all('/admin/api/socket.io/key', function (req, res, next) {
  var key = Math.random() + req.basicAuth.username + new Date().getTime()
          + Math.random() + Math.random() + Math.random() + Math.random();
  key = key.replace(/[^0-9a-zA-Z]/img, '');
  ioClientKeys.push(key);
  res.sendJSON({key: key});
});
io = io.listen(server);
io.configure(function () {
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
  io.set('log level', 2);
  io.set('authorization', function (handshakeData, callback) {
    var key = handshakeData.query.key;
    var i = ioClientKeys.indexOf(key);
    if (i !== -1) {
      ioClientKeys.splice(i, 1);
      callback(null, true);
      var isOK = true;
    }
    else {
      callback(null, false);
      var isOK = false;
    }
    var addr = handshakeData.address;
    logger.info('socket.io handshake from %s:%s is %s', addr.address, addr.port, isOK);
  });
  io.sockets.on('connection', function (socket) {
    logger.info('socket.io client [id:%s] connected.', socket.id);
    socket.on('disconnect', function () {
      logger.info('socket.io client [id:%s] disconnected.', socket.id);
    });
  });
});
logger.on('line', function (line, method) {
  for (var i in io.sockets.sockets) {
    io.sockets.sockets[i].emit('line', line, method);
  }
});


// 捕捉异常信息
process.on('uncaughtException', function (err) {
  logger.error('Uncaught exception: %s', err.stack);
});
