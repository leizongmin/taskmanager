'use strict';

/**
 * taskmanager task manager
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var logger = require('./logger');
 

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
  });
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
