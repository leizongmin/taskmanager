/**
 * taskmanager logger
 *
 * @author 老雷<leizongmin@gmail.com>
 */


module.exports = require('tracer').colorConsole({
  format :     '{{timestamp}} <{{title}}> {{message}}',
  dateformat : 'HH:MM:ss.L'
});
