setInterval(function () {
  console.log('[' + process.pid + ']\t' + new Date() + process.version);
}, 2000);

setInterval(function () {
  console.error('error [' + process.pid + ']\t' + new Date());
}, 5000);
