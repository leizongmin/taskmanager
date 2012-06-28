'use strict';

/**
 * taskmanager plus manager
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var logger = require('./logger');
var path = require('path');
var fs = require('fs');


/**
 * 取插件列表
 *
 * @param {function} callback
 */
exports.list = function (callback) {
  var list = [];
  var retList = function () {
    var ret = [];
    list.forEach(function (f) {
      try {
        var m = require(f);
        var n = path.basename(f);
        ret.push({name: n, about: m.about(), filename: f});
      }
      catch (err) {
        logger.error('[load plus] %s -- %s', f, err.stack);
      }
    });
    return callback(null, ret);
  };
  // 分别从内置的plus目录及用户的plus目录查找
  var dir1 = path.resolve(__dirname, '../plus');
  var dir2 = path.resolve('./plus');
  fs.readdir(dir1, function (err, ls1) {
    if (err)
      logger.warn('[list plus] %s', err.stack);
    if (Array.isArray(ls1))
      ls1.forEach(function (f) {
        list.push(path.resolve(dir1, f));
      });
    if (dir1 === dir2)
      return retList();
    fs.readdir(dir2, function (err, ls2) {
      if (err)
        logger.warn('[List plus] %s', err.stack);
      if (Array.isArray(ls2))
        ls2.forEach(function (f) {
          list.push(path.resolve(dir2, f));
        });
      return retList();
    });
  });
};

/**
 * 获取指定插件
 *
 * @param {string} name
 * @param {function} callback
 */
exports.get = function (name, callback) {
  var retPlus = function (m, filename) {
    if (typeof m.run !== 'function')
      return callback(new Error('Not a valid plus'));
    return callback(null, m, filename);
  };
  // 优先查找用户目录
  var dir1 = path.resolve('./plus', name);
  var dir2 = path.resolve(__dirname, '../plus', name);
  try {
    var m = require(dir1);
    if (m)
      return retPlus(m, dir1);
  }
  catch (err) {
    printErrorInfo(dir1, err);
  }
  try {
    var m = require(dir2);
  }
  catch (err) {
    printErrorInfo(dir2, err);
  }
  if (m)
    return retPlus(m, dir2);
  else
    return callback(new Error('Cannot find plus "' + name + '"'));
};

/**
 * 重装指定插件
 *
 * @param {name} name
 * @param {function} callback
 */
exports.reload = function (name, callback) {
  exports.get(name, function (err, m, filename) {
    if (err)
      return callback(err);
    var len = filename.length;
    logger.info('reload plus %s (%s)', name, filename);
    for (var i in require.cache) {
      if (i.substr(0, len) === filename) {
        delete require.cache[i];
        logger.info('remove require.cache["%s"]', i);
      }
    }
    return callback(null, filename);
  });
};

/**
 * 输出载入模块出错信息
 *
 * @param {string} dir
 * @param {object} err
 */
var printErrorInfo = function (dir, err) {
  var msg = err.toString();
  if (msg.indexOf('Cannot find module') !== -1)
    logger.debug('[load plus] %s -- %s', dir, msg);
  else
    logger.warn('[load plus] %s -- %s', dir, err.stack);
};
