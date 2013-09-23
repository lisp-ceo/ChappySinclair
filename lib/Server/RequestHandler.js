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

var requestHandler = function( pathName, request, postData, response ){

  console.log( 'PathName:', pathName || 'undefined' );
  console.log( 'Request:', request || 'undefined' );
  console.log( 'PostData:', postData || 'undefined' );
  console.log( 'Response:', response || 'undefined' );

  var body = 'Response';
  var status = '200';

  response.writeHead( status, {
    'Content-Type' : 'application/json',
    'Access-Control-Allow-Origin' : '*',
  } );
  response.write( JSON.stringify( body ));
  response.end();

};

module.exports = requestHandler;
