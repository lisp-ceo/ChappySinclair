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
 * JsDoc GLOBALS
 *
 * @callback successCallback success - Callback to handle successes
 * @callback errorCallback error - Callback to handle errors
 * @callback callback - Callback for all returns
 *
 */

/**
 * 
 * Imports
 *
 */
var _ = require( 'lodash' ),
    Command = require( './Command' ),
    Server = require( './Server/Server' ),
    TaskRunner = new require( './TaskRunner'),
    WSErrors = require( './Errors' );

    _.clone({});

/**
 *
 * ChappySinclair - Constructor for a ChappySinclair instance. Synch.
 * @constructor
 * @param {( Object | Object[] )} commands - Commands or Array of Commands for ChappySinclair
 * @param { Object } opt - Server options. Zzz.
 *
 */

var ChappySinclair = function ChappySinclair( commands, config ){

  this.config = {
    port : config.port || '5000',
    debug : config.port || true 
  };

  // Build internal commands table

  this._commandsTable = this._getCommandsTable( commands );

  // Start web server
  // Set up listeners for commands

  this._webServer = this._getWebServer( this.config );
  this.taskRunner = new TaskRunner();
    // Start all processes synchronously
  // Wait for a call to poll()

};

/**
 *
 *  runTasks - Run 
 *
 *  @param { string[] } tasks - Tasks ID's to run
 *  @param { callback } callback - Callback to make on completion
 *
 */

ChappySinclair.prototype.runTasks = function( tasks, success ){

  //debugger;
  var result = this.taskRunner.run( tasks, this._commandsTable );

  success( result );

};

/**
 * Stop - Stop ChappySinclair
 *
 */

ChappySinclair.prototype.stop = function(){

  this._webServer.stop();

};

/**
 *
 * Opportunity for jekyll-style format / generators
 *
 */

ChappySinclair.prototype._formatter = function( responseData ){ return responseData; };
ChappySinclair.prototype._generator = function( responseData ){ return responseData; };

/**
 *
 * _getCommandsTable - Returns a formattedCommandsTable
 *
 * @private
 * @param {( Object | Object[] )} commands - Commands or Array of Commands for ChappySinclair
 * @returns { Object } commandsTable - Object representing commands
 *
 */

ChappySinclair.prototype._getCommandsTable = function( commands ){

  var commandsTable = [];

  if( typeof commands === 'undefined' ){

    throw WSErrors.COMMANDS_UNDEFINED;

  } else if ( typeof commands.length === 'undefined' ){

    // Convery Object to Array of that Object
    commands = [ commands ];

  }

  // Convery Object Array to Array of CS.Command Objects
  _.each( commands, function itterator ( command ){

    try {

      // @TODO: After working out the randomness with valueOf / toString come back and take this hack out
      commandsTable.push( new Command( command.id, command.exec, command.success, command.error )); 
    
    } catch( e ){
    
      throw WSErrors.COMMANDS_INVALID.toStringWithClientObj( command );

    }

  });

  //debugger;

  return commandsTable;
  
};

/**
 *
 * Start - Start the ChappySinclair Server
 *
 * TODO: Use cb asynchronously when http.createServer fires create server
 * events
 */

ChappySinclair.prototype.start = function( cb ){

  cb();

};

ChappySinclair.prototype.poll = function(){

};

/**
 *
 * _getWebServer
 *
 * @private
 * @param { Object } config - Commands or Array of commands to execute
 * @returns { ChappySinclair.Server } ws - Reference to server instance
 *
 */

ChappySinclair.prototype._getWebServer = function( config ){

  return new Server( config, this );

};

ChappySinclair.prototype.getRouteList = function(){

  return this._formatter( this._generator( this._commandsTable ) );

};

/**
 *
 * Binding 'Static' Methods to CS
 *
 */

ChappySinclair.prototype.Command = Command;

module.exports = ChappySinclair;
