
// 自动刷新列表
setInterval(function () {
  window.location = '#/?r=' + new Date().getTime();
}, 5000);
