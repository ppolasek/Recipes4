"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var req_res_converter = require('./req_res_converter');
var logger = require('../logger');

/**
 * send_response.js
 *
 * Manage sending the response back to the caller.
 * The response codes are from https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */

//MongoError: E11000 duplicate key error index: recipes4.recipe_tag.$tagName_1 dup key: { : "Sandwich" }
//    at Function.MongoError.create (/Users/ppolasek/node_modules/mongodb/node_modules/mongodb-core/lib/error.js:31:11)
//    at toError (/Users/ppolasek/node_modules/mongodb/lib/utils.js:139:22)
//    at /Users/ppolasek/node_modules/mongodb/lib/collection.js:749:67
//    at /Users/ppolasek/node_modules/mongodb/node_modules/mongodb-core/lib/connection/pool.js:469:18
//    at process._tickCallback (node.js:355:11)
// { 'result' : { ok: yes|no },
//   'err' : { // either 'err' or 'return_obj' is to be returned, not both
//       msg: 'E11000 duplicate key error index: recipes4.recipe_tag.$tagName_1 dup key: { : "Sandwich" }'
//   },
//   'return_obj' : [
//       // json object here, if any, or nothing if no results are returned
//   ]
// }

exports.send_response = function (req, res) {
    if ('recipes4' in req && req.recipes4 !== null) {
        if ('output' in req.recipes4) {
            _ok(res, req.recipes4.output);
        } else if ('err' in req.recipes4) {
            _error(res, req.recipes4.err);
        } else {
            _ok(res, null);
        }
    } else {
        _ok(res, null);
    }
}

/**
 * Normal response to the client
 */
function _ok(response, output) {
    var obj = {};

    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (output != null) {
        obj = { 'result': { 'ok' : 'yes' },
            'return_obj' : [ output ]
        };
    } else {
        obj = { 'result': { 'ok' : 'yes' },
            'return_obj' : null
        };
    }

    var json = req_res_converter.convert_to_json(obj);

    // logger.debug('send_response.ok() json:');
    // logger.debug(json);

    // _addCors(response);
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(json);
    response.end();
}

/**
 * Return an error response to the client
 */
function _error (response, err) {

    var obj = { 'result': { 'ok' : 'no' },
        'err' : {
            'msg' : ('message' in err) ? err.message : 'null'
        }
    };

    var json = req_res_converter.convert_to_json(obj);

    logger.debug('send_response.error() json:');
    logger.debug(json);

    // _addCors(response);
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(json);
    response.end();
}
