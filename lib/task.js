'use strict';

/**
 * taskmanager task manager
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var logger = require('./logger');
var fs = require('fs');


// 任务列表
var taskList = exports._list = {};

var idCursor = 1;


/**
 * 加入任务队列
 *
 * @param {object} p
 * @return {int}
 */
exports.add = function (p) {
  var id = idCursor++;
  taskList[id] = p;
  p.on('exit', function () {
    logger.info('Task [id:%d] exit.', id);
    delete taskList[id];
    saveToFile();
  });
  saveToFile();
  return id;
};

/**
 * 任务列表
 *
 * @return {array}
 */
exports.list = function () {
  return taskList;
};

/**
 * 取指定ID的任务实例
 *
 * @param {int} id
 * @return {object}
 */
exports.get = function (id) {
  return taskList[id] || null;
};

/**
 * 保存任务列表
 */
var saveToFile = function () {
  var save = [];
  var timestamp = new Date();
  for (var i in taskList) {
    var t = taskList[i];
    if (t.process && t.process.pid && t.config) {
      save.push({
        pid:        t.process.pid,
        name:       t.config.name,
        main:       t.config.main,
        timestamp:  timestamp
      });
    }
  }
  save = JSON.stringify(save);
  fs.writeFile('processes.json', save, function (err) {
    if (err)
      logger.warn('Save process list to "processes.json" %s', err.stack);
  });
};
