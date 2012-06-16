/**
 * runner test
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 

var http = require('http');
var quickweb = require('quickweb-base');

var app = quickweb();

app.route.all('/', function (req, res, next) {
  console.log(req.headers);
  res.send('OK');
});

http.createServer(app.handler()).listen(31222);
