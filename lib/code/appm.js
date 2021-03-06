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
var fs = require('fs');
var path = require('path');
var scheduleTask = require('../schedule');


module.exports = function (route) {

  /**
   * 取插件列表
   */
  route.get('/admin/api/app/list', function (req, res, next) {
    app.list(function (err, list) {
      if (err)
        return res.sendError(500, err.stack);
      var ret = [];
      var readAppFail = function (n, err) {
        ret.push({name: n, description: err.toString()});
        nextApp();
      };
      var nextApp = function () {
        var n = list.shift();
        if (!n)
          return res.sendJSON(ret);
        app.get(n, function (err, conf) {
          if (err)
            return readAppFail(n, err.stack);
          plus.get((conf.type || 'default') + '.app', function (err, m) {
            if (err)
              return readAppFail(n, err.stack);
            ret.push({name: n, description: m.appDescription(conf)});
            nextApp();
          });
        });
      };
      nextApp();
    });
  });
  
  /**
   * 启动应用
   */
  route.post('/admin/api/app/start/:name', function (req, res, next) {
    var name = req.path.name;
    logger.info('[app:%s] start', name);

    app.get(name, function (err, conf) {
      if (err)
        return returnError(err.stack);

      var startApp = function (returnResult, returnError) {
        plus.get((conf.type || 'default') + '.app', function (err, m) {
          if (err)
            return returnError(err.stack);

          m.run(conf, function (err, p) {
            if (err)
              return returnError(err.stack);

            if (typeof conf.log === 'string') {
              try {
                var s = fs.createWriteStream(conf.log);
                s.on('open', function () {
                  logger.info('[app:%s] log file: %s', name, conf.log);
                  p.on('log', function (line, type) {
                    s.write(line);
                  });
                  p.on('exit', function () {
                    s.end();
                    s.destroySoon();
                  });
                });
              } catch (err) {
                logger.error('[app:%s] Cannot open log file: %s', name, conf.log);
              }
            }

            var pid = task.add(p);

            var appname = name;
            p.on('log', function (line, type) {
              type = type === 'out' ? 'stdout' : 'stderr';
              logger.emit('line', line.toString(), pid + ':' + appname + ':' + type);
            });

            return returnResult({pid: pid});
          });

        });
      };

      if (typeof conf.schedule === 'string' && (conf.schedule = conf.schedule.trim()) !== '') {
        var p = scheduleTask(conf, function () {
          startApp(function (data) {
            logger.info('[app:%s] Start app: pid=%s', name, data.pid);
          }, function (msg) {
            logger.error('[app:%s]: %s', name, msg);
          });
        });
        var pid = task.add(p);
        logger.info('[app:%s] Add schedule: %s', name, conf.schedule);
        res.sendJSON({pid: pid});
      }
      else {
        startApp(function (data) {
          res.sendJSON(data);
        }, function (msg) {
          res.sendError(500, msg);
        });
      }

    });
  });
  
};