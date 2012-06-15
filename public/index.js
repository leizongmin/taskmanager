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
    $.getJSON('/admin/api/socket.io/key', {r: Math.random()}, function (d) {
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
  };
  
  var $out = $('#online-logs .log-lines');
  var color = {
    info:   'cyan',
    debug:  'green',
    error:  'red',
    warn:   'yellow'
  };
  var onLine = function (msg) {
    var type = (msg + '').split(' ');
    type = '' + type[3];
    type = type.substr(1, type.length - 2).toLowerCase();
    var c = color[type];
    if (c)
      $out.append('<pre style="color:' + c + '">' + msg + '</pre>');
    else
      $out.append('<pre>' + msg + '</pre>');
    $out.scrollTop(1000000);
    console.log(msg);
  };
    
  connectToServer();
})();