$(document).ready(function () {
  
  var windowResize = function () {
    $w = $(window);
    $h = $('.top-bar');
    $me = $('#main-iframe');
    $me.height($w.height() - $h.height() - 28);
  };
  
  $(window).resize(windowResize);
  windowResize();
  
});
