#Test Port Provider

[![Build Status](https://travis-ci.org/jehy/test-port-provider.svg?branch=master)](https://travis-ci.org/jehy/test-port-provider)

Gets listenable ports (beginning from the one you pass) by trying to listen on them.

##Installation
```bash
npm install test-port-provider
```

##Usage
```js
var
  net          = require('net'),
  portProvider = require('test-port-provider');


  var PortProvider = new portProvider(80, '127.0.0.1', true, 100, true);
  var port=PortProvider.getPort();
  var port2=PortProvider.getPort();
  //use in in express or whatever...
```
## API
### constructor
```js
/**
 * @param startPort {int} the first port to start scanning
 * @param host {string} IP on which we should listen, default 127.0.0.1
 * @param tryTestPorts{boolean} whether we actually need to test ports or just give increments, default true
 * @param connectTimeout{int} connection timeout in ms, default 500
 * @param log {boolean} whether we need to output logs to console, default false
 * @constructor
 */
```
###getPort
```js
  /**
   * @name getPort
   * @return {int} port
   */
```
