
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
  $.getJSON('/admin/api/server/info', function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.render('#main', 'info', d);
  });
});

