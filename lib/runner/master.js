/**
 * runner master
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var http = require('http');
var quickweb = require('quickweb-base');
var path = require('path');
var fs = require('fs');
var cluster = require('./cluster');
var debug = require('./debug')('runner[master]');


/**
 * 启动管理接口
 *
 * @param {int} port
 * @param {string} host
 */
module.exports = function (port, host) {
  try {
    var app = quickweb();
  
    // 首页
    app.route.all('/', function (req, res, next) {
      res.sendStaticFile(path.resolve(__dirname, 'index.html'));
    });
    
    // 取子进程PID列表
    app.route.get('/workers', function (req, res, next) {
      var workers = [];
      cluster.workers.forEach(function (w) {
        workers.push({
          pid:        w.pid,
          timestamp:  w.timestamp
        });
      });
      res.sendJSON(workers);
    });
    
    // 启动新子进程
    app.route.post('/workers/fork', function (req, res, next) {
      var w = cluster.fork();
      res.sendJSON({
        pid:        w.pid,
        timestamp:  w.timestamp
      });
    });
    
    // 杀死所有子进程
    app.route.post('/workers/kill', function (req, res, next) {
      var ret = cluster.killAll();
      res.sendJSON({success: ret});
    });
    
    // 子进程详细信息
    app.route.get('/worker/:pid', function (req, res, next) {
      var w = cluster.getWorker(req.path.pid);
      res.sendJSON({
        pid:        w.pid,
        timestamp:  w.timestamp
      });
    });
    
    // 结束进程
    app.route.post('/worker/:pid/kill', function (req, res, next) {
      var ret = cluster.kill(req.path.pid);
      res.sendJSON({success: ret});
    });
    
    // 启动信息
    app.route.get('/info', function (req, res, next) {
      res.sendJSON({
        main:     process.env.RUNNER_MAIN,
        cwd:      process.env.RUNNER_WORKPATH,
        cluster:  process.env.RUNNER_CLUSTER,
        master:   process.env.RUNNER_LISTEN
      });
    });
    
    // 退出程序
    app.route.post('/exit', function (req, res, next) {
      res.sendJSON({success: true});
      process.nextTick(function () {
        debug('Master exit.');
        cluster.killAll();
        process.exit(0);
      });
    });
    
    var server = http.createServer(app.handler()).listen(port, host);
    return server;
  }
  catch (err) {
    console.error(err.stack);
    return null;
  }
};