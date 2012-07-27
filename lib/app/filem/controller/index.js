
/**
 * 出错信息
 */
QuickWeb.on('/error', function (e) {
  alert(e.query.msg);
  e.redirect('/');
});

var resolveParentPath = function (path) {
  if (/[\\\/]$/.test(path.substr(-1)))
    path = path.substr(0, path.length - 1);
  var x = path.match(/[^\\\/]*$/);
  if (Array.isArray(x) && x.length > 0)
    return path.substr(0, path.length - x[0].length);
  else
    return null;
};


/**
 * 首页
 */
QuickWeb.on('/', function (e) {
  var path = e.query.path || '.';
  $.getJSON('/admin/api/file/list', {path: path}, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    if (d.length > 0) {
      var f = resolveParentPath(d[0].path);
      if (f !== null)
        path = f;
    }
    $('input#filepath').val(path);
    e.render('#main', 'list', {list: d});
  });
});

/**
 * 上级目录
 */
QuickWeb.on('/up', function (e) {
  var path = $('input#filepath').val();
  path = resolveParentPath(path);
  e.redirect('/?path=' + path);
});

/**
 * 刷新
 */
QuickWeb.on('/refresh', function (e) {
  var path = $('input#filepath').val();
  e.redirect('/?path=' + path);
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

/**
 * 删除文件
 */
QuickWeb.on('/file/remove', function (e) {
  var path = e.query.path;
  if (!confirm('确定要删除文件' + path + '吗？'))
    return;
  $.post('/admin/api/file/remove', {path: path}, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.redirect('/refresh');
  }, 'json');
});
