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


// 当前时间
var getTimestamp = function () {
  var now = new Date();
  return 'UTC ' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
       + ' ' + now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();
};

// 文本颜色
var color = {
  info:     ['\033[36m', '\033[39m'],
  debug:    ['\033[32m', '\033[39m'],
  error:    ['\033[31m', '\033[39m'],
  warn:     ['\033[33m', '\033[39m']
};

var getMethod = function (method) {
  var c = color[method] || ['', ''];
  return function () {
    var msg = util.format.apply(null, arguments);
    var line = getTimestamp() + ' [' + method + '] ' + msg;
    console.log(c[0] + line + c[1]);
    this.emit('line', line);
    this.emit(method, line);
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
