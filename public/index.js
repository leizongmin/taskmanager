$(document).ready(function () {
  
  // 界面
  (function () {
    var windowResize = function () {
      $w = $(window);
      $h = $('.top-bar');
      $me = $('#main-iframe');
      $me.height($w.height() - $h.height() - 58);
      $('#online-logs .log-lines').height($('#online-logs').height() - 50);
    };
    $(window).resize(windowResize);
    windowResize();
  })();
    
});


// 过滤日志
var logFilterSwitch = {};
var logFilter = function (type, obj) {
  var $me = $(obj);
  if ($me.attr('checked')) {
    logFilterSwitch[type] = true;
    $('.logtype-' + type).show();
  }
  else {
    logFilterSwitch[type] = false;
    $('.logtype-' + type).hide();
  }
};

// 在线日志
(function () {
  var socket;

  var connectToServer = function () {
    var tid = 0;
    var connect = function () {
      onLine('获取连接密码...', 'info');
      $.getJSON('/admin/api/socket.io/key?' + new Date().getTime(), {r: Math.random()}, function (d) {
        onLine('连接到服务器...', 'info');
        socket = io.connect('/?key=' + d.key);
        socket.on('connect', onConnection)
              .on('disconnect', onDisconnect)
              .on('line', onLine)
              .on('connect', function () {
                clearInterval(tid);
              });
      });
    };
    tid = setInterval(connect, 30000);
    connect();
  };
  
  var onConnection = function () {
    onLine('连接服务器成功。', 'info');
  };
  
  var onDisconnect = function () {
    onLine('与服务器断开连接！正尝试重新连接，如果长时间无法连接，建议刷新页面。', 'warn');
    connectToServer();
  };

  window.logsSwitchToTask = function (id) {
    onLine('查看应用ID=' + id + '的控制台输出', 'info');
    socket.emit('switch-app', '' + id);
  };
  
  var escapeString = escape = function (input) {
    return String(input)
      .replace(/&(?!\w+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };
  
  var $out = $('#online-logs .log-lines');
  var logsCount = 0;
  var onLine = function (msg, type) {
    if (typeof msg !== 'string')
      msg = String(msg);
    if (logsCount++ >= 1000) {
      $('.log-lines pre:lt(500)').remove();
      logsCount = 500;
    }
    if (!type)
      type = 'log';
    else {
      var _type = type.split(':');
      if (_type.length >= 3) {
        var appname = _type[1];
        type = _type[1];
      }
    }
    if (logFilterSwitch[type] === false)
      var style = 'display: none;';
    else
      var style = '';
    msg = escapeString(msg);
    if (appname)
      msg = '<span class="log-appname">' + appname + '</span>' + msg;
    $out.append('<pre class="logtype-' + type + '" style="' + style + '">' + msg + '</pre>');
    $out.scrollTop(1000000);
    // console.log(msg);
  };
    
  connectToServer();
})();

