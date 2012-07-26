
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
  $.getJSON('/admin/api/app/list', function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.render('#main', 'list', {list: d});
  });
});

/**
 * 启动应用
 */
QuickWeb.on('/app/start/:name', function (e) {
  var name = e.param.name;
  $.post('/admin/api/app/start/' + name, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    parent.logsSwitchToTask(d.pid);
    window.location = '/app/taskm/';
  }, 'json');
});