'use strict';

/**
 * taskmanager plus: cluster
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var runner = require('../../lib/runner');
var path = require('path');
var util = require('util');
var events = require('events');

/**
 * 简介
 *
 * @return {string}
 */
exports.about = function () {
  return '以cluster进程方式执行指定Node.js文件';
};

/**
 * 应用描述信息
 *
 * @param {object} config
 * @return {string}
 */
exports.appDescription = function (config) {
  return '主文件名：' + config.main + '，子进程数：' + config.cluster;
};

/**
 * 启动应用
 *
 * @param {object} config     main:入口文件         execPath:命令，默认为node
 *                            maxLogs:日志记录数量  env:运行环境变量
 *                            args:启动参数         cluster:子进程数，默认为1
 * @param {function} callback
 */
exports.run = function (config, callback) {
  if (!config.main)
    return callback(new Error('Miss paramater "main"'));
  if (!Array.isArray(config.args))
    config.args = [];
  config.args.unshift(config.main);
  if (!(config.cluster > 0))
    config.cluster = 1;
  
  try {
    var p = runner(config.main, config.cluster, config);
    var ret = new appInstance(p, config);
    return callback(null, ret);
  }
  catch (err) {
    return callback(err);
  }
};

/**
 * 应用操作实例
 *
 * @param {object} p
 * @param {object} config
 */
var appInstance = function (p, config) {
  this.process = p;
  this.config = config;
  var self = this;
  p.stdout.on('data', function (data) {
    self.emit('log', data, 'out');
  });
  p.stderr.on('data', function (data) {
    self.emit('log', data, 'err');
  });
  p.on('exit', function () {
    self.emit('exit');
  });
};
util.inherits(appInstance, events.EventEmitter);

/**
 * 停止应用
 *
 * @param {function} callback
 */
appInstance.prototype.stop = function (callback) {
  var self = this;
  try {
    this.process.once('exit', function () {
       return callback(null);
    });
    this.process.api.killAll(function (err) {
      if (err)
        return callback(err);
      self.process.kill();
    });
  }
  catch (err) {
    return callback(err);
  }
};

/**
 * 应用状态
 *
 * @param {function} callback
 */
appInstance.prototype.status = function (callback) {
  var self = this;
  self.process.api.getWorkers(function (err, workers) {
    if (err)
      return callback(err);
    callback(null, {pid: self.process.pid, workers: workers});
  });
};

/**
 * 应用日志
 *
 * @param {function} callback
 */
appInstance.prototype.logs = function (callback) {
  var logs = this.process.logs;
  return callback(null, logs.stdout.join('\n'), logs.stderr.join('\n'));
};

/**
 * 执行指令
 *
 * @param {string} cmd
 * @param {array} args
 * @param {function} callback
 */
appInstance.prototype.exec = function (cmd, args, callback) {
  cmd = cmd.toLowerCase();
  switch (cmd) {
    case 'fork':
      return this.process.api.fork(callback);
    case 'kill':
      return this.process.api.kill(args.pid, callback);
    case 'killall':
      return this.process.api.killAll(callback);
    default:
      return callback(new Error('Not support command "' + cmd + '".'));
  }
};
