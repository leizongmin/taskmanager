'use strict';

/**
 * taskmanager debug
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
process.env.QUICKWEB_DEBUG = true;
if (typeof process.env.QUICKWEB_DEBUG === 'undefined') {
  module.exports = function () {
    return function () {};
  };
}
else {
  console.log('Enable debug output.');
  module.exports = function (modName) {
    var title = modName + ' -- ';
    return function () {
      var args = [title];
      for (var i in arguments)
        args.push(arguments[i]);
      console.log.apply(null, args);
    };
  };
}
