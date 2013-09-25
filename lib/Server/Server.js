/*
 * ChappySinclair
 * https://github.com/jrm/ChappySinclair
 *
 * Copyright (c) 2013 James Meldrum
 * Licensed under the MIT license.
 */

'use strict';

var http = require( 'http' ),
    url = require( 'url' ),
    requestHandler = require ( './RequestHandler' );

/**
 * Server
 * @constructor
 * @param { Object } config - Configuration options for server
 * @param { Object } CSRef - Pointer to CS instantiator
 */

var Server = function( config, CSRef ){

  this.CSRef = CSRef;
  this._http = http.createServer( this.onRequest.bind( this ));
  this._http.listen( config.port );

  console.log("Server has started on port ", config.port.toString() );
};

Server.prototype.onRequest = function onRequest ( request, response ) {

  var pathName = url.parse( request.url ).pathname,
  postData = "";

  console.log( "Request received. Path:" + pathName );

  request.setEncoding( 'utf8' );
  request.addListener( 'data' , function( postDataChunk ){

    postData += postDataChunk;

  });

  request.addListener( 'end', function(){

    requestHandler.call( this, pathName, request, postData, response );

  }.bind( this ));

};

Server.prototype.stop = function(){

  this._http.close();

};

module.exports = Server;
