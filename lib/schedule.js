'use strict';

/**
 * taskmanager app manager
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var logger = require('./logger');
var schedule = require('node-schedule');
var util = require('util');
var events = require('events');


/**
 * 创建一个计划任务
 *
 * @param {object} config
 * @param {function} createTask
 * @return {object}
 */
module.exports = function (config, createTask) {
  var p = new appInstance(config);
  p.job = schedule.scheduleJob(config.schedule, function () {
    try {
      p._writeLog('Start at ' + new Date());
      createTask();
    }
    catch (err) {
      p._writeError(err);
    }
  });
  return p;
};



/**
 * 应用操作实例
 *
 * @param {object} config
 */
var appInstance = function (config) {
  if (isNaN(config.maxLogs) || config.maxLogs < 1)
    config.maxLogs = 20;
  this.config = config;
  this._logs = {out: Array(config.maxLogs), err: Array(config.maxLogs)};
};
util.inherits(appInstance, events.EventEmitter);

/**
 * 写日志信息
 *
 * @param {string} line
 */
appInstance.prototype._writeLog = function (line) {
  line += '\n';
  this._logs.out.push(line);
  this._logs.out.shift();
  this.emit('log', line, 'out');
};

/**
 * 写出错信息
 *
 * @param {string} line
 */
appInstance.prototype._writeError = function (line) {
  line += '\n';
  this._logs.err.push(line);
  this._logs.err.shift();
  this.emit('log', line, 'err');
};

/**
 * 停止应用
 *
 * @param {function} callback
 */
appInstance.prototype.stop = function (callback) {
  this.job.cancel();
  this.emit('exit');
  callback(null);
};

/**
 * 应用状态
 *
 * @param {function} callback
 */
appInstance.prototype.status = function (callback) {
  return callback(null, {
    schedule:   this.config.schedule
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
  return callback(new Error('Not support command "' + cmd + '".'));
};
