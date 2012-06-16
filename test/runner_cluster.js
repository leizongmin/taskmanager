/**
 * runner test
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var should = require('should');
var cluster = require('../lib/runner/cluster');


describe('test cluster', function () {

  it('#normal', function (done) {
  
    if (cluster.isMaster) {
      var NUM = 4;
      var j = 0;
      cluster.on('message', function (pid, msg) {
        console.log(pid, msg);
        msg.should.equal(pid);
        cluster.kill(pid);
        j++;
        if (j >= NUM)
          done();
      });
      for (var i = 0; i < NUM; i++)
        cluster.fork();
    }
    else {
      console.log('I am PID:' + process.pid);
      cluster.send(process.pid);
    }
  
  });
  
});