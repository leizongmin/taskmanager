quickweb-runner
===============

    var runner = require('quickweb-runner');

    var p = runner('file.js', 5, {
      env: {},
      args: []
    });

    p.api.getWorkers(function (err, workers) {
      console.log(err, workers);
    });

    p.api.fork(function (err) {
      console.log(err);
    });
