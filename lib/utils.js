/**
 * utils
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var crypto = require('crypto');


/**
 * 32位MD5加密
 *
 * @param {string} text 文本
 * @return {string}
 */
exports.md5 = function (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

/**
 * 加密密码
 *
 * @param {string} password
 * @return {string}
 */
exports.encryptPassword = function (password) {
  var random = exports.md5('TaskManager' + Math.random()).toUpperCase();
  var left = random.substr(0, 2);
  var right = random.substr(-2);
  var newpassword = exports.md5(left + password + right).toUpperCase();
  return left + ':' + newpassword + ':' + right;
};

/**
 * 验证密码
 *
 * @param {string} password 待验证的密码
 * @param {string} encrypted 密码加密字符串
 * @return {bool}
 */
exports.validatePassword = function (password, encrypted) {
  var random = encrypted.toUpperCase().split(':');
  if (random.length < 3)
    return false;
  var left = random[0];
  var right = random[2];
  var main = random[1];
  var newpassword = exports.md5(left + password + right).toUpperCase();
  if (newpassword === main)
    return true;
  else
    return false;
};
