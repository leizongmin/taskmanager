
/**
 * 出错信息
 */
QuickWeb.on('/error', function (e) {
  alert(e.query.msg);
  e.redirect('/');
});

var pathHistory = [];

/**
 * 首页
 */
QuickWeb.on('/', function (e) {
  var path = e.query.path || '.';
  $.getJSON('/admin/api/file/list', {path: path}, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    $('input#filepath').val(path);
    e.render('#main', 'list', {list: d});
  });
});

/**
 * 编辑文件
 */
QuickWeb.on('/file/edit', function (e) {
  var path = e.query.path;
  $.getJSON('/admin/api/file/read', {path: path}, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.render('#main', 'editor', d);
  });
});
