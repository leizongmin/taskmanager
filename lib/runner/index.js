/**
 * runner
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var path = require('path');
var spawn = require('child_process').spawn;
var debug = require('./debug')('runner[master]');
var apiWrap = require('./api');


/**
 * 启动js文件
 *
 * @param {string} filename
 * @param {int} num
 * @param {object} options
 * @return {object}
 */
module.exports = function (filename, num, options) {
  options = options || {};
  if (isNaN(num) || num < 1)
    num = 1;
  
  // 运行环境
  var env = {};
  for (var i in process.env)
    env[i] = process.env[i];
  if (options.env) {
    for (var i in options.env)
      env[i] = options.env[i];
  }
  env.RUNNER_MAIN = path.resolve(filename);
  env.RUNNER_CLUSTER = num;
  // 管理监听端口
  if (!env.RUNNER_LISTEN)
    env.RUNNER_LISTEN = '127.0.0.1:' + randomPort();
  if (options.listen)
    env.RUNNER_LISTEN = options.listen;
  
  // 运行参数
  var args = [path.resolve(__dirname, 'runner.js')];
  if (Array.isArray(options.args)) {
    args = args.concat(options.args);
  }
  
  var run = spawn(process.execPath || options.execPath, args, {env: env});
  
  // 程序输出，原样输出
  if (isNaN(options.maxLogs) || options.maxLogs)
    options.maxLogs = 20;
  var pid = run.pid;
  run.logs = {stdout: [], stderr: []};
  var outLogs = run.logs.stdout;
  var errLogs = run.logs.stderr;
  var MAXLOGS = options.maxLogs;
  run.stdout.on('data', function (data) {
    data = data.slice(0, data.length - 1).toString();
    console.log('[PID:' + pid + '] ' + data);
    outLogs.push(data);
    if (outLogs.length > MAXLOGS)
      outLogs.shift();
  });
  run.stderr.on('data', function (data) {
    data = data.slice(0, data.length - 1).toString();
    console.error('[PID:' + pid + '] ' + data);
    errLogs.push(data);
    if (errLogs.length > MAXLOGS)
      errLogs.shift();
  });
  run.on('exit', function (code) {
    console.log('[PID:' + pid + ':Error] exited, code:' + code);
  });
  
  return apiWrap(run, env.RUNNER_LISTEN);
};

/**
 * 获取一个随机不重复的端口
 *
 * @return {int}
 */
var randomPort = function () {
  return PORT_CURRENT++;
}
var PORT_CURRENT = 40000 + parseInt(Math.random() * 10000);
