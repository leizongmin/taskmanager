

var currentId = 0;

/**
 * 出错信息
 */
QuickWeb.on('/error', function (e) {
  alert(e.query.msg);
  e.redirect('/');
});

/**
 * 首页
 */
QuickWeb.on('/', function (e) {
  e.redirect('/status/' + currentId);
});

/**
 * 显示指定任务的状态
 */
QuickWeb.on('/status/:id', function (e) {
  var id = e.param.id;
  currentId = id;
  $.getJSON('/admin/api/task/status/' + id, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    d.id = id;
    e.render('#status', 'status', d);
  });
  $.getJSON('/admin/api/task/logs/' + id, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    d.id = id;
    e.render('#logs', 'logs', d);
  });
});