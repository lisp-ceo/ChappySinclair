/*
 * ChappySinclair
 * https://github.com/jrm/ChappySinclair
 *
 * Copyright (c) 2013 James Meldrum
 * Licensed under the MIT license.
 */

'use strict';

var _ = require( 'lodash' );

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

var Command = function( id, exec, success, _error ){

  this.attributes.id = id;
  this.attributes.exec = exec;
  this.attributes.success = success;
  this.attributes._error = _error;

  return this;

};

Command.prototype.attributes = {};

/*
 *
 * TODO: Replace with a better implementation that stringifies functions
 *
 */

Command.prototype.toString = function(){

  return JSON.stringify( _.clone( this.attributes, true ));

};

Command.prototype.toJSON = function(){

  return _.clone( this.attributes );

};

// Setting public getters and setters
_.each( [ 'id', 'exec', 'success', '_error' ], function( property ){

  Object.defineProperty( Command.prototype, property, {
    get : function(){ return this.attributes[ property ]; },
    set : function( updatedValue ){ return this.attributes[ property ] = updatedValue; }
  });

});

module.exports = Command;
