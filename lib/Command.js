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
 *  - Sleeping : Command has been prepared, process is not running
 *  - Initializing: Running the Command constructor
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
    util = require( 'util' ),
    ChildProcess = require( 'child_process' ),
    CSDataDir = 'CSData',
    CSDataExt = '.json';

/*
 * Public Functions
 */

var Command = function( id, exec, exec_args ){

  EventEmitter.call( this ); 

  this.state = 'initializing';
  this.id = id;
  this.exec = exec;
  this.exec_args = exec_args;

  // @TODO: Document these. Refactor. These suck ass.

  this._log = {
    logPath : '',
    logHandle : undefined
  };

  this._process = {

    handle : undefined, // ChildProcess.spawn instance associated with this command
    stop : 'SIGTERM',
    pid : '1234',
    exitCode : '',
    startDateTime : '',
    endDateTime : '',
    buffers : {

      stdin   : undefined, // Bound in .start()
      stdout  : '',
      stderr  : '',
    
    }
  };

  this.state = 'sleeping';

};

util.inherits( Command, EventEmitter );

Command.prototype.toJSON = function(){

  return JSON.stringify({
    id : this.id.toString(),
    state : this.state.toString(),
    log : this._log.logPath.toString(),
    pid : this._process.pid.toString(),
    startDateTime : this._process.startDateTime.toString(),
    endDateTime : this._process.endDateTime.toString(),
    buffers : {

      stdout : this._process.buffers.stdout.toString(),
      stderr : this._process.buffers.stderr.toString()

    }
  });

};

/**
 *
 * Start - Execute the command and report status synchronously
 *
 * @param { Function } cb - Callback on success
 * @param { ResponseData } cbArgs - 
 *
 */

Command.prototype.start = function( cb, response ){

  console.log( 'start' );

  this.state = 'running';

  this._process.startDateTime = new Date();

  this._process.handle = this._getProcess( this.exec, this.exec_args, process.env );
  this._process.buffers.stdin = this._process.handle.stdin;
  this._process.pid = this._process.handle.pid;

  this._allocateLogsBuffersListenersSync();
  this._bindEventListenersSync( this._process.handle );

  response.status = '200';
  response.header = 'Command has started';
  response.body = this.toJSON();

  console.log( 'response: ', response );

  cb( response );

};

/**
 *
 * _getProcess - 
 *
 * @o
 *
 */

Command.prototype._getProcess = function( exec_string, exec_args ){

  return ChildProcess.spawn( exec_string, exec_args );

};

/**
 *
 *  _bindEventListenersSync - Convenience for implementing
 *  standard ChildProcess events
 *  http://nodejs.org/api/child_process.html
 */

Command.prototype._bindEventListenersSync = function( spawned_process ){

  var commandInstance = this;

  spawned_process.stdout.on( 'data', function( data ){

    console.log( 'Chunk: ', data.toString( 'utf8' ));
    commandInstance._process.buffers.stdout += data.toString( 'utf8' );

  });

  spawned_process.stdout.on( 'end', function(){

    console.log( 'StdOut closed' );

  });

  spawned_process.stderr.on( 'data', function( data ){

    commandInstance._process.buffers.stderr += data.toString();

  });

  spawned_process.stderr.on( 'end', function(){

    console.log( 'StdErr closed' );

  });

  spawned_process.on( 'close', function( exitCode, signal ){

    console.log( 'stdio streams to the process have terminated' );
    console.log( 'ExitCode:', exitCode.toString() );
    console.log( 'Signal:', signal );
  
  });

  spawned_process.on( 'disconnect', function(){

    console.log( 'This event is emitted after using the .disconnect() method in the parent or in the child' );
  
  });

  spawned_process.on( 'exit', function( exitCode, signal ){

    console.log( 'child process has ended' );
    console.log( 'ExitCode:', exitCode.toString() );
    console.log( 'Signal:', signal );
  
    commandInstance.exitCode = exitCode.toString();
    commandInstance.stop(); // Process has closed
  
  });

  spawned_process.on( 'error', function( error ){

    console.log( 'child process could not be spawned or killed or sending a message failed' );
    console.log( 'Error:', JSON.stringify( error ));

    //commandInstance.emit( 'error' );
  
  });

};

Command.prototype.stop = function(){

  // For now just sigint
  // this._process.handle // Spawn new process and run .stop over it
  this._process.endDateTime = new Date();
  this._process.exitCode = null; // Exited successfully
  this.state = 'sleeping';

  //this._process.handle.kill('SIGTERM');

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
 *  Allocates 
 *
 */

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

      this._log.logPath = path.join( process.cwd(), CSDataDir, this.id + CSDataExt );
    
    }.bind( this ));

  }.bind( this ));

};

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

/*
 *
 * TODO: Replace with a better implementation that stringifies functions
 *
 */

module.exports = Command;
