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
 */

var fs = require( 'fs' ),
    path = require( 'path' ),
    EventEmitter = require( 'events' ).EventEmitter,
    CSDataDir = 'CSData',
    CSDataExt = '.json';

var Command = function( id, exec, success, error ){

  EventEmitter.call( this );

  this.id = id;
  this.exec = exec;
  this.success = success;
  this.error = error;

};

/*
 *
 * open - Exec command and allocate logs, buffers and listeners
 *
 * @return {Object} this - Return Command instance
 *
 */


Command.prototype.open = function( taskRunnerRef ){

  this._allocateLogsBuffersListenersSync();

  // Allocating log


  // Task Runner.on( 'update', write to the file )
  return this;

};

Command.prototype._allocateLogsBuffersListenersSync = function(){

  fs.exists( path.join( process.cwd(), CSDataDir ), function( exists ){

    // Ensure base_path exists
    if( !exists ){
    
      fs.mkdirSync( path.join( process.cwd(), CSDataDir ));

    }

    // Check the job's path exists
    fs.exists( path.join( process.cwd(), CSDataDir, this.id + CSDataExt ), function( exists ){

      if( !exists ){

      }

      this.logPath = path.join( process.cwd(), CSDataDir, this.id + CSDataExt );
    
    });

  });

  // Allocate buffers

  this.stdIn = '';
  this.stdOut = '';
  this.stdErr = '';

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
