setInterval(function () {
  console.log('[' + process.pid + ']\t' + new Date() + process.version);
  console.log(process.argv, process.env);
  check();
}, 2000);

setInterval(function () {
  console.error('error [' + process.pid + ']\t' + new Date());
  check();
}, 5000);



var i = 0;
var check = function () {
  i++;
  console.log(i);
  if (i > 10)
    process.exit();
};
