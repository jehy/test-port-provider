'use strict';
var
  net          = require('net'),
  PortProvider = require('../script'),
  Promise      = require('bluebird');


describe('portProvider', function () {

  it('should provide some free ports without overlapping', function (done) {

    this.timeout(5000);
    var portProvider = new PortProvider(80, true, 500, false);
    var res = [];
    var err = false;

    var pr = new Promise(function (resolve, reject) {
      var added = 0;
      for (var i = 0; i < 100; i++) {
        portProvider.getPort().then(function (port) {
          var server = net.createServer(function (socket) {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
          });
          server.listen(port, '127.0.0.1');
          server.on('error', function (e) {
            console.log('Oops, port ' + port + ' is really busy :(');
            err = true;
          });
          server.on('listening', function (e) {
            var end = Promise.resolve(true).delay(1000).then(function () {
              server.close();
            });
            res.push(end);
            added++;
            if (added === 100)
              resolve();
          });
        });
      }
    });
    pr.then(function () {
      Promise.all(res).then(function () {
        if (err)
          done('Smth went wrong');
        else
          done();
      })
    })
  })
});