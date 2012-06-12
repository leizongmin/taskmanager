
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
  $.getJSON('/admin/api/task/list', function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.render('#main', 'list', {list: d});
  });
});

/**
 * 停止指定任务
 */
QuickWeb.on('/task/stop/:id', function (e) {
  var id = e.param.id;
  $.post('/admin/api/task/stop/' + id, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.redirect('/');
  }, 'json');
});
