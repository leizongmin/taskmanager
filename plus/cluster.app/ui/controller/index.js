

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

/**
 * 增加子进程
 */
QuickWeb.on('/fork', function (e) {
  e.redirect('/fork/' + currentId);
});
QuickWeb.on('/fork/:id', function (e) {
  var id = e.param.id;
  currentId = id;
  $.post('/admin/api/task/exec/' + id, {cmd: 'fork'}, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.redirect('/');
  });
});

/**
 * 结束子进程
 */
QuickWeb.on('/kill/:pid', function (e) {
  var id = currentId;
  var pid = e.param.pid;
  $.post('/admin/api/task/exec/' + id, {cmd: 'kill', args: JSON.stringify({pid: pid})}, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.redirect('/');
  });
});

