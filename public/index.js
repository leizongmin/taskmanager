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


// 在线日志
(function () {
  var socket;
  
  var connectToServer = function () {
    console.log('获取连接密码...');
    $.getJSON('/admin/api/socket.io/key', {r: Math.random()}, function (d) {
      console.log('连接到服务器...');
      socket = io.connect('http://localhost/?key=' + d.key);
      socket.on('connect', onConnection)
            .on('disconnect', onDisconnect)
            .on('line', onLine);
    });
  };
  
  var onConnection = function () {
    console.log('连接服务器成功。');
  };
  
  var onDisconnect = function () {
    console.log('与服务器断开连接！');
    connectToServer();
  };
  
  var $out = $('#online-logs .log-lines');
  var onLine = function (msg, type) {
    if (typeof msg !== 'string')
      return console.error('接收信息出错：', msg, type, appname);
    if (!type)
      type = 'log';
    else {
      var _type = type.split(':');
      if (_type.length >= 2) {
        var appname = _type[0];
        type = _type[1];
      }
    }
    if (logFilterSwitch[type] === false)
      var style = 'display: none;';
    else
      var style = '';
    if (appname)
      msg = '<span class="log-appname">' + appname + '</span>' + msg;
    $out.append('<pre class="logtype-' + type + '" style="' + style + '">' + msg + '</pre>');
    $out.scrollTop(1000000);
    // console.log(msg);
  };
    
  connectToServer();
})();

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
