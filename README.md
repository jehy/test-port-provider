#LogFox

[![Build Status](https://travis-ci.org/jehy/logfox.svg?branch=master)](https://travis-ci.org/jehy/logfox)

Checks if a TCP port on localhost is available for some out
 service by trying to listen on it.
##Installation
```bash
npm install test-port-provider
```

##Usage
```js
'use strict';
var
  net          = require('net'),
  portProvider = require('test-port-provider');


  var PortProvider = new portProvider(80, true, 100, true);
  var port=PortProvider.getPort();
  //use in in express or whatever...
```
## API
### constructor
```js
/**
 * @param startPort
 * @param tryTestPorts{boolean} whether we actually need to test ports or just give increments
 * @param connectTimeout{int} connection timeout in ms
 * @param log {boolean} whether we need to output logs to console
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
