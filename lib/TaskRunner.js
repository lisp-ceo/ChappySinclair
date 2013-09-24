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
 * ChappySinclair.TaskRunner - Commands used by ChappySinclair
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
 *        Reimplement this a queue
 */

var _ = require( 'lodash' ),
    EventEmitter = require( 'events' ).EventEmitter;

var TaskRunner = function(){

  EventEmitter.call( this );

  this.openCommands = {};

};

/**
 * TaskRunner - Execute a tasks from given task list
 *
 * @param { string[] } tasks - Command objects to execute
 * @param { Object[] } commandstable - Command objects to execute
 *
 */

TaskRunner.prototype.run = function run ( tasks, commandsTable ){

  var returnBody = '';

  // Test to see if it's in the commands
  _.each( tasks, function( task ){

    var taskLaunched = false;
    //debugger;

    _.each( commandsTable, function( command ){

      console.log( 'Debug: ', task, command );
      //debugger;
 
      // Not launched and not open
      if( !taskLaunched && typeof this.openCommands[ task ] === 'undefined' ){ // @TODO: Might need to throw errorr?!

        if( command.id === task ){
        
          console.log( 'Running task', task, command.id );
          taskLaunched = true;
          returnBody = this.openCommand( task, command );

        }
      
      }
    
    }.bind( this ));

  }.bind( this ));

  return returnBody;

};

/**
 *
 * openCommand - Exec command and allocate logs, buffers and listeners
 *
 * @returns command.execSync() {String} - Response body for request
 *
 */

TaskRunner.prototype.openCommand = function( task, command ){

  this.openCommands[ task ] = command;

  return command.execSync();

  // Bind listenrs

};

/*
 *
 * TODO: Replace with a better implementation that stringifies functions
 *
 */

module.exports = TaskRunner;
