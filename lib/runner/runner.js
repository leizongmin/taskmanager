'use strict';

/**
 * runner
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var cluster = require('./cluster');
var path = require('path');
if (cluster.isMaster) {
  var debug = require('./debug')('runner[master]');
}
else {
  var debug = require('./debug')('runner[worker]');
}


/**
 * 退出程序
 */
var die = function (msg, code) {
  //console.error(new Error(msg));
  //process.exit(code);
  throw new Error(msg);
};

/*-------------------------------- 启动参数 ----------------------------------*/
var mainFile = process.env.RUNNER_MAIN;       // 要启动的程序入口文件，必须
var clusterNum = process.env.RUNNER_CLUSTER;  // 启动的子进程数量，默认=1
var workPath = process.env.RUNNER_WORKPATH;   // 程序工作目录，默认=.
var listenAddr = process.env.RUNNER_LISTEN;   // 管理器监听端口，默认无，格式：127.0.0.1:55555
if (!mainFile)
  return die('Please specify a main file from env "RUNNER_MAIN".');
if (isNaN(clusterNum) || clusterNum < 1)
  clusterNum = 1;
if (!workPath)
  workPath = '.';
if (listenAddr) {
  var listen = {host: '127.0.0.1'};
  var addr = listenAddr.split(':');
  if (addr.length === 1) {
    listen.port = parseInt(addr[0]);
  }
  else if (addr.length === 2) {
    listen.host = addr[0].trim();
    listen.port = parseInt(addr[1]);
  }
  if (isNaN(listen.port) || addr.length > 2 || !listen.host) {
    return die('Wrong listen address format from env "RUNNER_LISTEN": ' + listenAddr);
  }
}
else {
  var listen = null;
}

/*-------------------------------- 启动程序 ----------------------------------*/
if (cluster.isMaster) {
  cluster.on('message', function (pid, msg) {
    var w = cluster.getWorker(pid);
    if (msg === '__cluster_is_running__' && w) {
      w.is_forever = true;
      debug('Worker ' + pid + ' alive.');
    }
  });
  debug('Fork ' + clusterNum + ' worker:');
  for (var i = 0; i < clusterNum; i++) {
    cluster.fork();
  }
  if (listen) {
    debug('Master listen on ' + listenAddr);
    require('./master')(listen.port, listen.host);
  }
}
else {
  debug('Loading file "' + mainFile + '"...');
  process.chdir(workPath);
  require(path.resolve(workPath, mainFile));
  debug('Worker ' + process.pid + ' is running.');
  cluster.send('__cluster_is_running__');
}

