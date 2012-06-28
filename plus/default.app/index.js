'use strict';

/**
 * taskmanager plus: default
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var spawn = require('child_process').spawn;
var path = require('path');
var util = require('util');
var events = require('events');

/**
 * 简介
 *
 * @return {string}
 */
exports.about = function () {
  return '默认方式，直接执行指定Node.js文件';
};

/**
 * 应用描述信息
 *
 * @param {object} config
 * @return {string}
 */
exports.appDescription = function (config) {
  return '入口文件名：' + config.main;
};

/**
 * 启动应用
 *
 * @param {object} config     main:入口文件         execPath:命令，默认为node
 *                            maxLogs:日志记录数量  env:运行环境变量
 *                            args:启动参数
 * @param {function} callback
 */
exports.run = function (config, callback) {
  if (!config.main)
    return callback(new Error('Miss paramater "main"'));
  if (!Array.isArray(config.args))
    config.args = [];
  config.args.unshift(config.main);
  
  try {
    var p = spawn(config.execPath || process.execPath, config.args, {env: config.env});
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
  if (isNaN(config.maxLogs) || config.maxLogs < 1)
    config.maxLogs = 20;
  this.process = p;
  this.config = config;
  this._logs = {out: Array(config.maxLogs), err: Array(config.maxLogs)};
  var logOut = this._logs.out;
  var logErr = this._logs.err;
  var self = this;
  p.stdout.on('data', function (data) {
    process.stdout.write(data);
    logOut.push(data);
    logOut.shift();
    self.emit('log', data, 'out');
  });
  p.stderr.on('data', function (data) {
    process.stderr.write(data);
    logErr.push(data);
    logErr.shift();
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
  try {
    this.process.once('exit', function () {
       return callback(null);
    });
    this.process.kill();
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
  return callback(null, {
    pid:    this.process.pid
  });
};

/**
 * 应用日志
 *
 * @param {function} callback
 */
appInstance.prototype.logs = function (callback) {
  return callback(null, this._logs.out.join(''), this._logs.err.join(''));
};

/**
 * 执行指令
 *
 * @param {string} cmd
 * @param {array} args
 * @param {function} callback
 */
appInstance.prototype.exec = function (cmd, args, callback) {
  return callback(new Error('Not support cmd "' + cmd + '".'));
};
