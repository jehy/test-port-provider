'use strict';
var
  net     = require('net'),
  Promise = require('bluebird');
/**
 *
 * @param [startPort] {int} the first port to start scanning, default 81
 * @param [host] {string} IP on which we should listen, default 127.0.0.1
 * @param [tryTestPorts]{boolean} whether we actually need to test ports or just give increments, default true
 * @param [connectTimeout]{int} connection timeout in ms, default 500
 * @param [log] {boolean} whether we need to output logs to console, default false
 * @constructor
 */
var TestPortProvider = function (startPort, host, tryTestPorts, connectTimeout, log) {
  if (tryTestPorts === undefined)
    tryTestPorts = true;
  if (host === undefined)
    host = '127.0.0.1';
  if (startPort === undefined)
    startPort = 81;
  if (connectTimeout === undefined)
    connectTimeout = 500;
  this.currentPort = parseInt(startPort, 10);

  this.incrementPort = function () {
    if (this.currentPort == 65534) {
      this.currentPort = 1;
    }
    else {
      this.currentPort++;
    }
  };
  this.getPort = function () {
    var p      = this,
        testMe = this.currentPort;
    return Promise.resolve().then(function () {
      if (!tryTestPorts)
        return (testMe);
      else
        return p.testPorts(host, testMe);
    }).timeout(connectTimeout).catch(Promise.TimeoutError, function (e) {
      throw new Error("could not get port for test within " + connectTimeout + "ms");
    });
  };

  this.testPorts = function (host, port) {
    var p = this;
    return new Promise(function (resolve, reject) {
      var server = net.createServer(function (socket) {
        socket.write('Echo server\r\n');
        socket.pipe(socket);
      });

      server.listen(port, host);
      server.on('error', function (e) {
        var tryPort = port + 1;
        if (p.currentPort > tryPort) {
          tryPort = p.currentPort + 1;
        }
        p.incrementPort();
        resolve(p.testPorts(host, tryPort));
      });
      server.on('listening', function (e) {
        server.close(function () {
          if (log)
            console.log('port ' + port + ' is available!');
          resolve(port);
        });
      });
    });
  };
};

module.exports = TestPortProvider;