
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

/**
 * 编辑应用
 */
QuickWeb.on('/app/edit/:name', function (e) {
  var name = e.param.name;
  $.getJSON('/admin/file/view?path=data/' + name + '.app.json&r=' + new Date().getTime(), function (d) {
    e.render('#main', 'editor', d);
  });
});

/**
 * 添加应用
 */
QuickWeb.on('/app/add', function (e) {
  e.render('#main', 'editor', {});
});

/**
 * 保存应用配置
 */
QuickWeb.on('/app/save', function (e) {
  var save = {
    name:       $('#app-name').val(),
    main:       $('#app-main').val(),
    type:       $('#app-type').val(),
    cluster:    $('#app-cluster').val(),
    execPath:   $('#app-execPath').val(),
    log:        $('#app-log').val(),
    args:       $('#app-args').val(),
    env:        $('#app-env').val()
  };
  save.args = save.args.trim().split(/\s+/g);
  if (save.args.length === 1 && save.args[0] === '')
    save.args = [];
  save.env = save.env.split(/[\r\n]+/g);
  var env = {};
  save.env.forEach(function (n) {
    var ns = n.split('=');
    var n = ns[0];
    var v = (ns[1] || '').trim();
    if (n !== '')
      env[n] = v;
  });
  save.env = env;
  save.cluster = parseInt(save.cluster);
  if (isNaN(save.cluster))
    delete save.cluster;

  if (!save.name)
    return alert('请指定应用名称！');

  var json = JSON.stringify(save);
  $.post('/admin/api/file/save', {
    path:   'data/' + save.name + '.app.json',
    data:   json
  }, function (d) {
    if (d.error)
      return e.redirect('/error?msg=' + d.error);
    e.redirect('/');
  }, 'json');
});

/**
 * 删除应用
 */
QuickWeb.on('/app/remove/:name', function (e) {
  var name = e.param.name;
  if (!confirm('确定要删除应用' + name + '吗？'))
    return;
  $.post('/admin/api/file/remove', {
    path:  'data/' + name + '.app.json'
  }, function (d) {
    e.redirect('/');
  }, 'json');
});