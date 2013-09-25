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
 * Global request handler for the app
 *
 * @function
 * @param { Object } response - 
 * @param { Object } postData - Post Data associated with request
 *
 * @TODO This is really a Router, dude.
 * 
 */

var _ = require( 'lodash' );
var requestHandlers = {
  list    : require( './RequestHandlers' ).list,
  stop    : require( './RequestHandlers' ).stop,
  start   : require( './RequestHandlers' ).start,
  logs    : require( './RequestHandlers' ).logs,
  ws      : require( './RequestHandlers' ).ws,
  default : require( './RequestHandlers' ).default
};
  
var requestHandler = function( pathName, request, postData, response ){

  var router = [{
      route : 'start',
      re : new RegExp('\/start.*','gi')
    },
    {
      route : 'logs',
      re : new RegExp('\/logs.*','gi')
    },
    {
      route : 'ws',
      re : new RegExp('\/ws.*','gi')
    },
    {
      route : 'list',
      re : new RegExp('\/list.*','gi')
    },
    {
      route : 'default',
      re : new RegExp( '.*', 'gi' )
  }],

  routed = false;

  _.each( router, function( val ){

    if( val.re.test( pathName ) && !routed ){

      routed = true;
      requestHandlers[ val.route ]( this.CSRef, pathName, request, postData, response, function(){ console.log( 'CB called for ', pathName );});

    }
  
  }.bind( this ));

};


module.exports = requestHandler;
