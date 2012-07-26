setInterval(function () {
  console.log('[' + process.pid + ']\t' + new Date() + process.version);
  console.log(process.argv, process.env);
}, 2000);

setInterval(function () {
  console.error('error [' + process.pid + ']\t' + new Date());
}, 5000);
