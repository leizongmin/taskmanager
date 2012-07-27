/**
 * taskmanager cli-init
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var fs = require('fs');
var path = require('path');


var mkdir = function (name) {
  try {
    fs.mkdirSync(name);
    console.log('create directory "\x1B[36m%s\x1B[39m" ... [\x1B[32mok\x1B[39m]', name);
  } catch (err) {
    console.log('create directory "\x1B[36m%s\x1B[39m" ... [\x1B[33mfail\x1B[39m]\n%s', name, err.toString());
  }
};

var mkfile = function (name, data) {
  try {
    fs.writeFileSync(name, data);
    console.log('create file "\x1B[36m%s\x1B[39m" ... [\x1B[32mok\x1B[39m]', name);
  } catch (err) {
    console.log('create file "\x1B[36m%s\x1B[39m" ... [\x1B[33mfail\x1B[39m]\n%s', name, err.toString());
  }
};



mkdir('data');
mkdir('plus');
mkfile('data/myapp.app.json', JSON.stringify({
  name:     'myapp',
  type:     'default',
  main:     'data/myapp.js'
}));
var fn = function () {
  setInterval(function () {
    console.log('timestamp=' + new Date().getTime());
  }, 1000);
  console.log('I am running...');
};
mkfile('data/myapp.js', '(' + fn.toString() + ')();');
mkfile('taskmanager.json', {
  port:           8860,
  admin:          'admin',
  password:       '3A:5B9AD333E3F867CB4666DB4702C315F0:FD',
  loginFail:      5,
  refuseTimeout:  60
});


console.log('OK.');
process.exit();
