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


// 捕捉异常信息
process.on('uncaughtException', function (err) {
  logger.error('Uncaught exception: %s', err.stack);
});
