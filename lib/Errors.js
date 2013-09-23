/*
 * ChappySinclair
 * https://github.com/jrm/ChappySinclair
 *
 * Copyright (c) 2013 James Meldrum
 * Licensed under the MIT license.
 */

/**
 *
 * ChappySinclair.Command - Commands used by ChappySinclair
 *
 * @constructor
 * @param { String } id - Unique string identifying process to CS and User
 * @param { String } exec - String to execute
 * @param { successCallback } success - Callback to handle successes
 * @param { errorCallback } error - Callback to handle errors
 *
 * Notes: Implements Backbone's this.attributes model.
 *        Only so toJSON would be a copypasta
 */

var _Error = function ChappySinclairError( message ){

  this.message = message;

  return message;

};

_Error.prototype.toString = function(){

  return this.message;

};

_Error.prototype.toStringWithClientObj = function( clientObj ){

  return this.toString() + JSON.stringify( clientObj );

};

var Errors = {
  COMMANDS_UNDEFINED  : new _Error( 'No commands provided to ChappySinclair. Shutting down...'),
  COMMANDS_INVALID    : new _Error( 'Command Object not valid: ')
};

module.exports = Errors;
