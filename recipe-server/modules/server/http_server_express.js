"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var my_config = require('../my_config');
var logger = require('../logger');
var express = require('express');
var app = express();
var recipes4 = require('../recipes4/recipes4_app');
var bodyParser = require('body-parser');
var cors = require('cors');
var req_res_converter = require('./req_res_converter');
var send_response = require('./send_response');

/**
 * http_server_express.js
 *
 * Start the HTTP server and hand off the request/response management to
 * another module.
 */

/**
 * Start the recipe-server web server that will process database requests.
 * @param callback The function to invoke with either the error or when processing is complete.
 */
exports.start_server = function (callback) {
    try {

        // create application/json parser
        var jsonParser = bodyParser.json()

        var nodejs_port = my_config.nodejs_port();

        if (nodejs_port === 0) {
            callback(new Error('nodejs_port not found'), null);
        }

        var corsOptionsDelegate = function (req, callback) {
            var corsOptions;
            corsOptions = {
                origin: '*', // reflect (enable) the requested origin in the CORS response
                methods: ['POST'],
                maxAge: 10,
                credentials: false,
                allowedHeaders: "access-control-allow-origin,origin,x-requested-with,access-control-request-headers,content-type,access-control-request-method,accept"
            }
            callback(null, corsOptions) // callback expects two parameters: error and options
        }

        app.options('*', cors(corsOptionsDelegate)) // include before other routes (from http://expressjs.com/en/resources/middleware/cors.html)
        // app.use(bodyParser.json());
        app.use(cors());
        app.use(req_res_converter.add_recipes4_obj);
        app.use(req_res_converter.request_property_converter);
        app.use('/Recipes4/services', jsonParser, recipes4);
        app.use(req_res_converter.response_property_converter);

        // this does not call 'next()'
        app.use(send_response.send_response);

        app.listen(nodejs_port, function () {
            logger.info('Server started on port ' + nodejs_port);
            console.log('Server started on port ' + nodejs_port);
            callback(null, true);
        });
    } catch (err) {
        logger.error('caught error: %s', err);
    }
}

// TODO export functions to listen for db requests and shutdown the server
