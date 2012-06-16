/**
 * runner api
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var http = require('http');
var debug = require('./debug')('runner[api]');
var apiWrap = require('./api');
var util = require('quickweb-base').util;


/**
 * 封装API操作
 *
 * @param {object} p
 * @param {string} listenAddr
 * @return {object}
 */
module.exports = function (p, listenAddr) {
  var listen = {host: '127.0.0.1'};
  var addr = String(listenAddr).split(':');
  if (addr.length === 1) {
    listen.port = parseInt(addr[0]);
  }
  else if (addr.length === 2) {
    listen.host = addr[0].trim();
    listen.port = parseInt(addr[1]);
  }
  
  p.listen = listen.host + ':' + listen.port;
  p.api = new Api(listen.host, listen.port);
  p.exit = function (signal) {
    p.kill(signal);
  };
  
  return p;
};


/**
 * API操作对象
 *
 * @param {string} host
 * @param {int} port
 */
var Api = function (host, port) {
  this.host = host;
  this.port = port;
};

/**
 * 发起HTTP请求
 *
 * @param {object} options
 * @param {function} callback
 */
Api.prototype.request = function (options, callback) {
  var self = this;
  // 发起请求
  var nerverCallback = true;
  var client = http.request({
    host:     '127.0.0.1',
    path:     options.path,
    method:   options.method || 'GET',
    headers:  options.headers,
    port:     options.port || self.port
  }, function (res) {
    var data = util.bufferArray();
    res.on('data', function (chunk) {
      data.push(chunk);
    });
    res.on('end', function () {
      if (nerverCallback) {
        callback(null, res, data.toBuffer())
        nerverCallback = false;
      }
    });
    res.on('error', function (err) {
      if (nerverCallback) {
        callback(err);
        nerverCallback = false;
      }
    });
  });
  client.end(options.data);
};

/**
 * 取进程列表
 *
 * @param {function} callback
 */
Api.prototype.getWorkers = function (callback) {
  this.request({path: '/workers'}, function (err, res, body) {
    if (err)
      return callback(err);
    var data = JSON.parse(body.toString());
    return callback(null, data);
  });
};

/**
 * 启动新子进程
 *
 * @param {function} callback
 */
Api.prototype.fork = function (callback) {
  this.request({path: '/workers/fork', method: 'POST'}, function (err, res, body) {
    if (err)
      return callback(err);
    var data = JSON.parse(body.toString());
    return callback(null, data);
  });
};

/**
 * 结束子进程
 *
 * @param {int} pid
 * @param {function} callback
 */
Api.prototype.kill = function (pid, callback) {
  this.request({path: '/worker/' + pid + '/kill', method: 'POST'}, function (err, res, body) {
    if (err)
      return callback(err);
    var data = JSON.parse(body.toString());
    return callback(null, data);
  });
};

/**
 * 结束所有子进程
 *
 * @param {function} callback
 */
Api.prototype.killAll = function (callback) {
  this.request({path: '/workers/kill', method: 'POST'}, function (err, res, body) {
    if (err)
      return callback(err);
    var data = JSON.parse(body.toString());
    return callback(null, data);
  });
};
