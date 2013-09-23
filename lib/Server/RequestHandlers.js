/*
 * ChappySinclair
 * https://github.com/jrm/ChappySinclair
 *
 * Copyright (c) 2013 James Meldrum
 * Licensed under the MIT license.
 */

'use strict';
var _ = require( 'lodash' );
var ResponseData = function( status, header, body){

  this.status = status;
  this.header = header;
  this.body = body;

};

var GenericHandler = function( cSRef, pathName, request, postData, response, success ){

  this.cSRef = cSRef;
  this.pathName = pathName;
  this.request = request;
  this.postData = postData;
  this.response = response;
  this.success = success;

};

GenericHandler.prototype.respond = function( responseData ){

  this.response.writeHead( responseData.status, responseData.head );
  this.response.write( JSON.stringify( responseData.body ));
  this.response.end();

  this.success();

};

var list = function ListHandler( cSRef, pathName, request, postData, response, success ){

  console.log( 'list called' );
  GenericHandler.call( this, cSRef, pathName, request, postData, response, success );
  GenericHandler.prototype.respond.call( this, new ResponseData( '200', 'header', cSRef.getRouteList() ));

},

_default = function DefaultHandler( cSRef, pathName, request, postData, response, success ){

  console.log( 'default called' );
  GenericHandler.call( this, cSRef, pathName, request, postData, response, success );
  GenericHandler.prototype.respond.call( this, new ResponseData( '200', 'header', 'default.body' ));

},

run = function RunHandler( cSRef, pathName, request, postData, response, success ){

  GenericHandler.call( this );
  GenericHandler.call( this, cSRef, pathName, request, postData, response, success );
  GenericHandler.prototype.respond.call( this, new ResponseData( '200', 'header', 'run.body' ));

},

logs = function LogsHandler( cSRef, pathName, request, postData, response, success ){

  GenericHandler.call( this, cSRef, pathName, request, postData, response, success );
  GenericHandler.prototype.respond.call( this, new ResponseData( '200', 'header', 'logs.body' ));

},

ws = function WsHandler( cSRef, pathName, request, postData, response, success ){

  GenericHandler.call( this, cSRef, pathName, request, postData, response, success );
  GenericHandler.prototype.respond.call( this, new ResponseData( '200', 'header', 'ws.body' ));

};
  

// Extend all methods from GenericHandler

  _.each([ list, run, logs, ws, _default ], function( handler ){
  
    var handler_old = handler;
  
    handler.prototype = Object.create( GenericHandler.prototype );
    handler.prototype.constructor = handler_old;
  
  });

exports.list    = list;
exports.run     = run;
exports.logs    = logs;
exports.ws      = ws;
exports.default = _default;
