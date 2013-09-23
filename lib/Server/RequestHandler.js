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
  run     : require( './RequestHandlers' ).run,
  logs    : require( './RequestHandlers' ).logs,
  ws      : require( './RequestHandlers' ).ws,
  default : require( './RequestHandlers' ).default
};
  
var requestHandler = function( pathName, request, postData, response ){

  var router = [{
      route : 'run',
      re : new RegExp('\/run.*','gi')
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
