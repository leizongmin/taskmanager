'use strict';

/**
 * taskmanager app manager
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var logger = require('../logger');
var app = require('../app');
var plus = require('../plus');
var task = require('../task');


module.exports = function (route) {

  /**
   * 取插件列表
   */
  route.get('/admin/api/task/list', function (req, res, next) {
    var list = task.list();
    var ret = [];
    var ids = Object.keys(list);
    var nextTask = function () {
      var id = ids.shift();
      if (!id)
        return res.sendJSON(ret);
      var t = list[id];
      plus.get((t.config.type || 'default') + '.app', function (err, m) {
        if (err)
          var status = err.toString();
        else
          var status = m.appDescription(t.config);
        ret.push({id: id, status: status, type: t.config.type || 'default'});
        nextTask();
      });
    };
    nextTask();
  });
  
  /**
   * 停止指定任务
   */
  route.post('/admin/api/task/stop/:id', function (req, res, next) {
    var t = task.get(req.path.id);
    if (!t)
      return res.sendError(500, new Error('This task does not exist.'));
    logger.info('[task:%s] stop', req.path.id);
    t.stop(function (err) {
      if (err)
        return res.sendError(500, err.stack);
      return res.sendJSON({id: req.path.id});
    });
  });
  
  /**
   * 取任务状态
   */
  route.get('/admin/api/task/status/:id', function (req, res, next) {
    var t = task.get(req.path.id);
    if (!t)
      return res.sendError(500, new Error('This task does not exist.'));
    t.status(function (err, status) {
      if (err)
        return res.sendError(500, err.stack);
      return res.sendJSON(status);
    });
  });
  
  /**
   * 取任务日志
   */
  route.get('/admin/api/task/logs/:id', function (req, res, next) {
    var t = task.get(req.path.id);
    if (!t)
      return res.sendError(500, new Error('This task does not exist.'));
    t.logs(function (err, stdout, stderr) {
      if (err)
        return res.sendError(500, err.stack);
      return res.sendJSON({stdout: stdout, stderr: stderr});
    });
  });
  
  /**
   * 执行指定命令
   */
  route.post('/admin/api/task/exec/:id', function (req, res, next) {
    var t = task.get(req.path.id);
    if (!t)
      return res.sendError(500, new Error('This task does not exist.'));
    var cmd = req.post.cmd;
    if (!cmd)
      return res.sendError(500, new Error('Miss paramater "cmd"'));
    var args = req.post.args;
    if (typeof args === 'string')
      args = JSON.parse(args);
    logger.info('[task:%s] exec cmd: %s', req.path.id, cmd);
    t.exec(cmd, args, function (err, ret) {
      if (err)
        return res.sendError(500, err.stack);
      return res.sendJSON(ret);
    });
  });
  
};