
// 出错信息
QuickWeb.on('/error', function (e) {
  alert(e.query.msg);
  e.redirect('/');
});

QuickWeb.on('/', function (e) {
  $.getJSON('/admin/api/plus/list', function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.render('#main', 'list', {list: d});
  });
});

/**
 * 重装指定插件
 */
QuickWeb.on('/reload/:name', function (e) {
  var name = e.param.name;
  $.post('/admin/api/plus/reload/' + name, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.redirect('/');
  });
});
