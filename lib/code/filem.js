/**
 * taskmanager file manager
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var logger = require('../logger');
var path = require('path');
var fs = require('fs');

module.exports = function (route) {

  /**
   * 列出指定目录的文件
   */
  route.get('/admin/api/file/list', function (req, res, next) {
    var dir = path.resolve(req.get.path);
    fs.readdir(dir, function (err, files) {
      if (err)
        return res.sendError(500, err.stack);
      var list = [];
      var nextFile = function () {
        var f = files.shift();
        if (!f) {
          return res.sendJSON(list);
        }
        else {
          fs.stat(path.resolve(dir, f), function (err, stats) {
            if (err)
              var file = {name: f, error: err.toString()};
            else
              var file = {
                name:   f,
                type:   stats.isDirectory() ? 'dir' : 'file',
                mtime:  stats.mtime,
                atime:  stats.atime,
                ctime:  stats.ctime,
                size:   stats.size,
                uid:    stats.uid,
                gid:    stats.gid
              };
            file.path = path.resolve(dir, f);
            list.push(file);
            nextFile();
          });
        }
      };
      nextFile();
    });
  });
  
  /**
   * 取指定文件内容
   */
  route.get('/admin/api/file/read', function (req, res, next) {
    var filename = path.resolve(req.get.path);
    if (!filename)
      return res.sendError(500, new Error('Miss paramater "path".'));
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err)
        return res.sendError(500, err.stack);
      else
        return res.sendJSON({filename: filename, data: data});
    });
  });
  
  /**
   * 浏览指定文件
   */
  route.get('/admin/file/view', function (req, res, next) {
    var filename = path.resolve(req.get.path);
    if (!filename)
      return res.sendError(500, new Error('Miss paramater "path".'));
    res.sendStaticFile(filename);
  });
  
  /**
   * 保存指定文件内容
   */
  route.post('/admin/api/file/save', function (req, res, next) {
    var filename = path.resolve(req.post.path);
    var data = req.post.data;
    if (!filename)
      return res.sendError(500, new Error('Miss paramater "path".'));
    if (!data)
      return res.sendError(500, new Error('Miss paramater "data".'));
    fs.writeFile(filename, data, function (err) {
      if (err)
        return res.sendError(500, err.stack);
      else
        return res.sendJSON({filename: filename});
    });
  });
  
};