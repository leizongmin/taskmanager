'use strict';

/**
 * taskmanager server info
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var os = require('os');
var path = require('path');
var version = require('../../package.json').version;

module.exports = function (route) {

  // 取服务器信息
  route.get('/admin/api/server/info', function (req, res, next) {
    var meminfo = process.memoryUsage();
    var sysinfo = {
      hostname :    os.hostname(),
      systemtype :  os.type(),
      release :     os.release(),
      uptime :      os.uptime(),
      loadavg :     os.loadavg(),
      totalmem :    os.totalmem(),
      freemem :     os.freemem(),
      cpus :        os.cpus(),
      node : {
        ver :       process.versions.node,
        v8 :        process.versions.v8,
        openssl :   process.versions.openssl,
        path :      process.execPath,
      },
      taskmanager : {
        ver :       version,
        path :      path.resolve(__dirname, '../../'),
        uptime :    process.uptime(),
        rss:        meminfo.rss,
        heaptotal:  meminfo.heapTotal,
        heapused:   meminfo.heapUsed
      }
    };
    res.sendJSON(sysinfo);
  });

};