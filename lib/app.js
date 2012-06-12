/**
 * taskmanager app manager
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var logger = require('./logger');
var path = require('path');
var fs = require('fs');


/**
 * 取应用列表
 *
 * @param {function} callback
 */
exports.list = function (callback) {
  var list = [];
  // 读取当前的data目录
  try {
    fs.readdir(path.resolve('./data'), function (err, files) {
      if (err)
        return callback(err);
      files.forEach(function (f) {
        if (f.substr(-9) === '.app.json')
          list.push(f.substr(0, f.length - 9));
      });
      return callback(null, list);
    });
  }
  catch (err) {
    return callback(err);
  }
};

/**
 * 获取指定应用
 *
 * @param {string} name
 * @param {function} callback
 */
exports.get = function (name, callback) {
  try {
    fs.readFile(path.resolve('./data', name + '.app.json'), 'utf8', function (err, data) {
      if (err)
        return callback(err);
      try {
        data = JSON.parse(data);
      }
      catch (err) {
        return callback(err);
      }
      return callback(null, data);
    });
  }
  catch (err) {
    return callback(err);
  }
};

/**
 * 保存指定应用
 *
 * @param {string} name
 * @param {object} data
 * @param {function} callback
 */
exports.save = function (name, data, callback) {
  try {
    var save = JSON.stringify(data);
    fs.writeFile(path.resolve('./data', name + '.app.json'), save, callback);
  }
  catch (err) {
    return callback(err);
  }
};
