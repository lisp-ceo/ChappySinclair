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

var Command = function( id, exec, success, error ){

  this.id = id;
  this.exec = exec;
  this.success = success;
  this.error = error;

};

/*
 *
 * TODO: Replace with a better implementation that stringifies functions
 *
 */

module.exports = Command;
