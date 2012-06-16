/**
 * runner test
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 

var http = require('http');
var quickweb = require('quickweb-base');

var app = quickweb();

app.use(function (req, res, next) {
  //res.sendJSON(req.headers);
  res.sendStaticFile('index.html');
});

http.createServer(app.handler()).listen(40000 + parseInt(Math.random() * 1000));
