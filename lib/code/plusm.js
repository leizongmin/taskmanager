/**
 * taskmanager plus manager
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var logger = require('../logger');
var plus = require('../plus');
var path = require('path');
var quickweb = require('quickweb-base');
var mvc = require('quickweb-mvc');


module.exports = function (route, server) {

  // 插件列表
  var uiConnect = quickweb.connect();
  
  var updatePlusList = function (list) {
    uiConnect = quickweb.connect();
    list.forEach(function (n) {
      var f = n.filename;
      var p = '/plusui/' + path.basename(f) + '/';
      var uif = path.resolve(f, 'ui');
      var m = mvc.middleware({path: uif, prefix: p, debug: true});
      logger.log('register plus UI: %s => %s', p, uif);
      uiConnect.use(m);
    });
    logger.info('update %d plus UI', list.length);
  };
  
  plus.list(function (err, list) {
    if (err)
      return logger.error(err.stack);
    updatePlusList(list);
  });

  var uiConnect = 
  server.use('/plusui/', function (req, res, next) {
    logger.log('request plus UI: %s %s', req.method, req.url);
    uiConnect.start(req, res, function (err) {
      if (err)
        return res.sendError(500, err);
      next();
    });
  });
  

  /**
   * 取插件列表
   */
  route.get('/admin/api/plus/list', function (req, res, next) {
    plus.list(function (err, list) {
      if (err)
        return res.sendError(500, err.stack);
      updatePlusList(list);
      return res.sendJSON(list);
    });
  });
  
};