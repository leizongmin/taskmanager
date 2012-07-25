'use strict';

/**
 * taskmanager logger
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var util = require('util');
var events = require('events');


// 日志对象
var logger = function () {
};
util.inherits(logger, events.EventEmitter);

var n2 = function (n) {
  return n < 10 ? '0' + n : n;
};
// 当前时间
var getTimestamp = function () {
  var now = new Date();
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  var dd = now.getDate();
  var hh = now.getUTCHours();
  var ii = now.getUTCMinutes();
  var ss = now.getUTCSeconds(); 
  return yy + '/' + mm + '/' + dd + ' ' + n2(hh) + ':' + n2(ii) + ':' + n2(ss) + ' UTC';
};

// 文本颜色
var color = {
  info:     ['\x1B[36m', '\x1B[39m'],
  debug:    ['\x1B[32m', '\x1B[39m'],
  error:    ['\x1B[31m', '\x1B[39m'],
  warn:     ['\x1B[33m', '\x1B[39m']
};

var getMethod = function (method) {
  var c = color[method] || ['', ''];
  return function () {
    var msg = util.format.apply(null, arguments);
    var line = getTimestamp() + ' [' + method + '] ' + msg;
    console.log(c[0] + line + c[1]);
    this.emit('line', line, method);
  };
};

var methods = ['error', 'warn', 'info', 'log', 'debug'];
for (var i in methods) {
  var method = methods[i];
  logger.prototype[method] = getMethod(method);
};


module.exports = new logger();

/*
module.exports.on('line', function (msg) {
  console.log(msg)
});
*/
