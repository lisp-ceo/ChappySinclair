/*
 * ChappySinclair
 * https://github.com/jrm/ChappySinclair
 *
 * Copyright (c) 2013 James Meldrum
 * Licensed under the MIT license.
 */

'use strict';

/**
 *
 * ChappySinclair.Command - Commands  are essentially wrappers around
 * processes. Once the process closes, the Command will persist. 
 * The Command will go to sleep.
 *
 * Command states:
 *
 *  - Running: Process is running, Command is capturing stdOut/stdErr, Command
 *  can issue stdIn
 *  - Started : Command has been prepared, it is not running
 *  - Initializing: Running the constructor
 *
 * Command state variables all provided to constructor
 *
 * @constructor
 * @param { String } id - Unique string identifying process to CS and User
 * @param { String } exec - String to execute
 *
 * Notes: Implements Backbone's this.attributes model.
 *        Only so toJSON would be a copypasta
 *
 * @TODO: Command instance variables are created with Command function calls.
 *        This is stupid. Consolidate this.
 *        3 public functions - start, stop,
 */

var fs = require( 'fs' ),
    path = require( 'path' ),
    EventEmitter = require( 'events' ).EventEmitter,
    ChildProcess = require( 'child_process' ),
    CSDataDir = 'CSData',
    CSDataExt = '.json';

/*
 * Public Functions
 */

var Command = function( id, exec ){

  EventEmitter.call( this ); 

  this.id = id;
  this.exec = exec;

  // @TODO: Document these. Refactor. These suck ass.

  this._log = {
    logPath : '',
    logHandle : undefined
  };

  this._process = {
    handle : undefined, // ChildProcess.spawn instance associated with this command
    procID : '1234',
    exitCode : '',
    startDateTime : '',
    endDateTime : '',
    buffers : {

      stdin   : undefined, // Bound in .start()
      stdout  : '',
      stderr  : '',
    
    }
  };

};

/**
 *
 * Start - Execute the command and report status synchronously
 *
 * @param exec { String } - String of shell to execute
 *
 */

Command.prototype.start = function( exec ){

  var spawn = ChildProcess.spawn;

  this._process.handle = spawn( exec );
  this._process.buffers.stdin = this._process.handle;

  this._bindEventListeners();



};

/**
 *
 *  _bindEventListeners - Convenience for implementing
 *  standard ChildProcess events
 *  http://nodejs.org/api/child_process.html
 */

Command.prototype._bindEventListeners = function(){

  var commandInstance = this;

  this._process.handle.stdout.on( 'data', function( data ){

    commandInstance._process.buffers.stdout += data.toString();

  });

  this._process.handle.stderr.on( 'data', function( data ){

    commandInstance._process.buffers.stderr += data.toString();

  });

  this._process.handle.on( 'close', function( exitCode, signal ){

    console.log( 'stdio streams to the process have terminated' );
    console.log( 'ExitCode:', exitCode.toString() );
    console.log( 'Signal:', signal.toString() );
  
  });

  this._process.handle.on( 'disconnect', function(){

    console.log( 'This event is emitted after using the .disconnect() method in the parent or in the child' );
  
  });

  this._process.handle.on( 'exit', function( exitCode, signal ){

    console.log( 'child process has ended' );
    console.log( 'ExitCode:', exitCode.toString() );
    console.log( 'Signal:', signal.toString() );
  
    commandInstance.exitCode = exitCode.toString();
    commandInstance.stop(); // Process has closed
  
  });

  this._process.handle.on( 'error', function( error ){

    console.log( 'child process could not be spawned or killed or sending a message failed' );
    console.log( 'Error:', JSON.stringify( error ));

    commandInstance.emit( 'error' );
  
  });

};

Command.prototype.stop = function(){

  


  this.emit( this.events.stop ); 

};

/*
 *
 * Public Events
 *
 */

Command.prototype.events = {

  stop : 'stop', // Command has stopped
  start : 'start', // Command has stopped
  chunk : 'chunk' // Command has new stdout/stderr

};

/*
 *
 * 
 *
 */

/*
 *
 *
 * execSync - Exec command and allocate logs, buffers and listeners
 *
 * @return {Object} 
 *
 */


Command.prototype.execSync = function( taskRunnerRef ){

  var result = ' NEW KING IS IN TOWN ';
  this.taskRunnerRef = taskRunnerRef;

  this._allocateLogsBuffersListenersSync(); // Could be done before exec'ing
  result = this._spawnCommandAsChildProcAndExec( this.exec );
  // Task Runner.on( 'update', write to the file )
  // Write result to log file
  return this.getJSONFormattedCommandResponse( result );

};

/**
 *
 *  getJSONFormattedCommandReponse - get the command's response as JSON
 *
 */

Command.prototype.getJSONFormattedCommandResponse = function( result ){

  return JSON.stringify({
    id : this.id,
    exec : this.exec,
    result : result
  });

};


Command.prototype.execAsync = function(){};

Command.prototype._allocateLogsBuffersListenersSync = function(){

  fs.exists( path.join( process.cwd(), CSDataDir ), function( exists ){

    // Ensure base_path exists
    if( !exists ){
    
      fs.mkdirSync( path.join( process.cwd(), CSDataDir ));

    }

    // Check the job's path exists
    fs.exists( path.join( process.cwd(), CSDataDir, this.id + CSDataExt ), function( exists ){

      if( !exists ){
      
        // Do things here if it exists, for now, just append to end of file

      }

      this.logPath = path.join( process.cwd(), CSDataDir, this.id + CSDataExt );
    
    }.bind( this ));

  }.bind( this ));

  // Allocate buffers

  this.stdIn = [];
  this.stdOut = [];
  this.stdErr = [];

  // Allocating listener

  return;
};

/**
 *  Start - starts a command
 */

Command.prototype.start = function(){
};

/*
 *
 * TODO: Replace with a better implementation that stringifies functions
 *
 */

module.exports = Command;
