
// 保存文件内容
var saveFile = function () {
  var filename = $('#editor-filename').val().trim();
  var data = $('#editor-data').val();
  $.post('/admin/api/file/save', {path: filename, data: data}, function (d) {
    if (d.error)
      alert(d.error);
    else
      alert('保存成功！\n文件名：' + filename);
  }, 'json');
};

// 在地址栏中按下回车
$('#filepath').keypress(function (e) {
  var c= e.charCode || e.keyCode || e.which;
  if (c === 13) {
    gotoPath();
  }
});

// 转到指定路径
function gotoPath () {
  location = '#/?path=' + $('input#filepath').val().trim();
}