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

  var responseData = {
    head : {
      'Content-Type' : 'application/json',
      'Access-Control-Allow-Origin' : '*',
    },
    body : 'Response',
    status : '200'
  };

  //console.log( 'PathName:', pathName || 'undefined' );
  //console.log( 'Request:', request || 'undefined' );
  //console.log( 'PostData:', postData || 'undefined' );
  //console.log( 'Response:', response || 'undefined' );

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
  }];

  _.each( router, function( val ){

    if( val.re.test( pathName ) ){

      responseData = requestHandlers[ val.route ]( pathName, request, postData, response, function(){
        console.log( 'CB called for ', pathName );
      });

    }
  
    // Default is just to return an 'I'm Up' response

  });


};


module.exports = requestHandler;
