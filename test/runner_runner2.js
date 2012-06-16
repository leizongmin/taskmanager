/**
 * runner test
 *
 * @author 老雷<leizongmin@gmail.com>
 */
 
var should = require('should');
var path = require('path');
var runner = require('../lib/runner');


describe('test runner', function () {
  
  it('#process working', function (done) {
  
    var p = runner(path.resolve(__dirname, 'runner/s2.js'), 2);
    p.api.getWorkers(function (err, workers) {
      should.equal(err, null);
      console.log(workers);
      
      p.api.request({port: 31222}, function (err, res, body) {
        should.equal(err, null);
        body.toString().should.equal('OK');
        
        p.exit();
        done();
      });
    });
    
  });
  
});