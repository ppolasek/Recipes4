"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var http = require('http');
var my_config = require('../../my_config');
var logger = require('../../logger');
var req_res = require('./req_res');

/**
 * http_server.js
 *
 * Start the HTTP server and hand off the request/response management to
 * another module.
 */

var http_server;

/**
 * Start the recipe-server web server that will process database requests.
 * @param callback The function to invoke with either the error or when processing is complete.
 */
exports.start_server = function (callback) {
    try {
        var nodejs_port = my_config.nodejs_port();

        if (nodejs_port == 0) {
            callback(new Error('nodejs_port not found'), null);
        }

        http_server = http.createServer(req_res.handleRequestResponse);

        http_server.listen(nodejs_port, function () {
            logger.info('Server started on port ' + nodejs_port);
            console.log('Server started on port ' + nodejs_port);
            callback(null, true);
        });

    } catch (err) {
        logger.error('caught error: %s', err);
    }
}

// TODO export functions to listen for db requests and shutdown the server
