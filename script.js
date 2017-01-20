'use strict';
var
  net     = require('net'),
  Promise = require('bluebird');
/**
 *
 * @param startPort
 * @param tryTestPorts{boolean} whether we actually need to test ports or just give increments
 * @param connectTimeout{int} connection timeout in ms
 * @param log {boolean} whether we need to output logs to console
 * @constructor
 */
var TestPortProvider = function (startPort, tryTestPorts, connectTimeout, log) {
  this.currentPort = startPort;
  if (tryTestPorts === undefined)
    tryTestPorts = true;

  this.incrementPort = function () {
    if (this.currentPort == 65535)
      this.currentPort = 1;
    else
      this.currentPort++;
  };
  /**
   * @name getPort
   * @return {int} port
   */
  this.getPort = function () {
    var p = this;
    var testMe = p.currentPort;
    p.incrementPort();
    return Promise.resolve().then(function () {
      if (!tryTestPorts)
        return (testMe);
      else
        return p.testPorts(testMe);
    }).timeout(connectTimeout).catch(Promise.TimeoutError, function (e) {
      throw new Error("could not get port for test within " + connectTimeout + "ms");
    });
  };

  this.testPorts = function (port) {
    var p = this;
    return new Promise(function (resolve, reject) {
      var server = net.createServer(function (socket) {
        socket.write('Echo server\r\n');
        socket.pipe(socket);
      });

      server.listen(port, '127.0.0.1');
      server.on('error', function (e) {
        if (log)
          console.log('port ' + port + ' is busy, trying ' + (port + 1));
        if (p.currentPort > port + 1) {
          port = p.currentPort + 1;
          p.incrementPort();
        }
        resolve(p.testPorts(port));
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