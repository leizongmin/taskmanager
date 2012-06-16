/**
 * runner test
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var should = require('should');
var path = require('path');
var runner = require('../lib/runner');


describe('test runner', function () {

  it('#normal', function (done) {
  
    var p = runner(path.resolve(__dirname, 'runner/s1.js'), 1);
    
    p.api.getWorkers(function (err, workers) {
      should.equal(err, null);
      console.log(workers);
      workers.length.should.equal(1);
      p.exit();
      done();
    });
    
  });
  
  it('#kill', function (done) {
  
    var p = runner(path.resolve(__dirname, 'runner/s1.js'), 2);
    
    p.api.getWorkers(function (err, workers) {
      should.equal(err, null);
      console.log(workers);
      workers.length.should.equal(2);
      
      p.api.kill(workers[0].pid, function (err, ret) {
        should.equal(err, null);
        console.log(ret);
        ret.success.should.equal(true);
        
        setTimeout(function () {
          p.api.getWorkers(function (err, workers) {
            should.equal(err, null);
            console.log(workers);
            workers.length.should.equal(1);
            
            p.exit();
            done();
          });
        }, 500);
      });
    });
    
  });
  
  it('#killAll', function (done) {
  
    var p = runner(path.resolve(__dirname, 'runner/s1.js'), 2);
    
    p.api.getWorkers(function (err, workers) {
      should.equal(err, null);
      console.log(workers);
      workers.length.should.equal(2);
     
      p.api.killAll(function (err, ret) {
        should.equal(err, null);
        console.log(ret);
        ret.success.should.equal(2);
        
        p.exit();
        done();
      });
    });
    
  });
  
});