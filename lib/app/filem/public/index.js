
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