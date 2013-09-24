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
 * ChappySinclair.Command - Commands used by ChappySinclair
 *
 * @constructor
 * @param { String } id - Unique string identifying process to CS and User
 * @param { String } exec - String to execute
 * @param { successCallback } success - Callback to handle successes
 * @param { errorCallback } _error - Callback to handle errors
 *
 * Notes: Implements Backbone's this.attributes model.
 *        Only so toJSON would be a copypasta
 *
 * @TODO: Command instance variables are created with Command function calls.
 *        This is stupid. Consolidate this.
 */

var fs = require( 'fs' ),
    path = require( 'path' ),
    EventEmitter = require( 'events' ).EventEmitter,
    ChildProcess = require( 'child_process' ),
    CSDataDir = 'CSData',
    CSDataExt = '.json';

var Command = function( id, exec, success, error ){

  EventEmitter.call( this ); // Call class constructor with this instance. Super-classing.

  this.id = id;
  this.exec = exec;
  this.success = success;
  this.error = error;

  // @TODO: Document these. Refactor. These suck ass.
  this.taskRunnerRef = undefined;
  this.stdIn = undefined;
  this.stdOut = undefined;
  this.stdErr = undefined;
  this.logPath = undefined;
  this.commandAsChildProc = undefined; // ChildProcess.spawn instance associated with this command

};

/*
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

Command.prototype._spawnCommandAsChildProcAndExec = function( exec ){

  var spawn = ChildProcess.spawn;
  var commandAsChildProc = spawn( exec );
  var commandInstance = this;

  this.commandAsChildProc = commandAsChildProc;

  commandAsChildProc.stdout.on( 'data', function( data ){

    commandInstance.stdout += data.toString();
    console.log( 'Command::StdOut::Chunk:', data.toString());
    console.log( 'Command::StdOut::Total:', commandInstance.stdout);

  });

  commandAsChildProc.stderr.on( 'data', function( data ){

    commandInstance.stderr += data.toString();
    console.log( 'Command::StdErr::Chunk:', data.toString());
    console.log( 'Command::StdErr::Total:', commandInstance.stderr);

  });

  commandAsChildProc.on( 'close', function( exitCode ){
    
    // Write response
    // Fire Event saying response body is ready

  });

  // Ability to listen to STDIN here. Not used now
  /*
  commandAsChildProc.stdin.on( 'data', function( data ){

    commandInstance.stdin += data.toString();
    console.log( 'Command::StdOut::Chunk:', data.toString());
    console.log( 'Command::StdOut::Total:', commandInstance.stdin);

  });
  */

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

/**
 *
 * Execute the command synchronously and report status webSockets
 *
 */

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
