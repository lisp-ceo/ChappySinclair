# ChappySinclair [![Build Status](https://secure.travis-ci.org/jrm/ChappySinclair.png?branch=master)](http://travis-ci.org/jrm/ChappySinclair)

Network Singleton Process Manager

## Getting Started
Install the module with: `npm install ChappySinclair`

```javascript
var ChappySinclair = require('ChappySinclair');
ChappySinclair.awesome(); // "awesome"
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 James Meldrum  
Licensed under the MIT license.

## Spec

- Write grunt-contrib-coach: singleton process manager
  - Launch several processess (from a directory cwd)
    - node _lib/
  - Keep track of their PID's
    - Report them centrally
  - Implement common commands for them - start, stop, restart, std-out
    redirection
    - Have all coach members implement an interface
      - Should just be able to send SIGINT / SIGTERM, wait and then restart
  - Report them over http?!
    - Options to redirect std_out, std_err (std_out/std_err combined),
      redirect std_in over http
    - Security concern: Anyone outside of the VPC will be able to
      communicate with this process.

## Model:

  Client: 
    * CS object created by client
    * CS specs read from hidden JSON file called .ChappySinclair.json- eventually, just using Obj notation
      throughout for now
    * Each 'command' to be run is an Object:

    {
      id : "",
      exec : "",
      success : function(){
        // Return value determines what to do on success
        // Return "RESTART" to restart
        // Return another id like "#_id" to launch that process
      },
      error   : function(){}
    }

  SuperClass:
    * CS server launched
      * Internal processes read from Objects
      * Local log caches prepared, synced to disk, should function like Object
        store
    * Waits on port
    * When polled, reads from GET/POST - eventually, just GET now 
      * Returns data as JSON
    * Routes
      * / - Default
      * /run
      * 

## TODO:
  * Model out Chappy
  * Boot app that issues terminal commands and stores their std-in
  
