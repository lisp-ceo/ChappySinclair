/*
 * ChappySinclair
 * https://github.com/jrm/ChappySinclair
 *
 * Copyright (c) 2013 James Meldrum
 * Licensed under the MIT license.
 */

/**
 *
 * ChappySinclair._Error - Errors used by ChappySinclair
 *
 * @constructor
 * @param { String } message - message associated with the error
 *
 */

var _Error = function ChappySinclairError( message ){

  this.message = message;

  return message;

};

/**
 *
 *  toString - Override default
 *  @function
 *  @returns {String} message - message associated with the error
 */

_Error.prototype.toString = function(){

  return this.message;

};

/**
 *
 *  toStringWithClientObj - If you wish to log debug info associated with this
 *  object pass it as the only param
 *
 *  @function
 *  @param { Object } clientObj - Client object to log with error
 *
 */

_Error.prototype.toStringWithClientObj = function( clientObj ){

  return this.toString() + JSON.stringify( clientObj );

};

var Errors = {
  COMMANDS_UNDEFINED  : new _Error( 'No commands provided to ChappySinclair. Shutting down...'),
  COMMANDS_INVALID    : new _Error( 'Command Object not valid: ')
};

module.exports = Errors;
