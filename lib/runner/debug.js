'use strict';

/**
 * runner debug
 *
 * @author 老雷<leizongmin@gmail.com>
 */

if (typeof process.env.TASKMANAGER_DEBUG === 'undefined') {
  module.exports = function () {
    return function () {};
  };
}
else {
  console.log('Enable runner debug output.');
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
