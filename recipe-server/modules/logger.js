"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var winston = require('winston');
var offset = new Date().getTimezoneOffset() * 60000;

/**
 * logger.js
 *
 * Internal logger wrapping the Winston logger.
 */

var logger = new (winston.Logger) ( {
    transports: [
//        new (winston.transports.Console) (),
        new (winston.transports.File) ( {
            name: 'default-file',
            filename: 'recipe-server/logs/recipe_server.log',
            level: 'debug',
            timestamp: function() {
                // this version subtracts the offset to give MDT (Denver time)
                return new Date(Date.now() - offset).toISOString().replace(/[TZ]/g, ' ');
            },
            json: false,
            colorize: false,
            maxsize: 1000000,
            maxFiles: 10,
            prettyPrint: true,
            showLevel: false
        } ),
        new (winston.transports.File) ( {
            name: 'error-file',
            filename: 'recipe-server/logs/recipe_server_errors.log',
            level: 'error',
            timestamp: function() {
                // this version subtracts the offset to give MDT (Denver time)
                return new Date(Date.now() - offset).toISOString().replace(/[TZ]/g, ' ');
            },
            json: false,
            colorize: false,
            maxsize: 1000000,
            maxFiles: 10,
            prettyPrint: true,
            showLevel: false
        } )
    ]
  });

exports.debug = function () {
    var a = [];
    a.push('debug');
    for (var i = 0; i < arguments.length; i++) {
            a.push(arguments[i]);
    };
    logger.log.apply(logger, a);
}

exports.info = function () {
    var a = [];
    a.push('info');
    for (var i = 0; i < arguments.length; i++) {
            a.push(arguments[i]);
    };
    logger.log.apply(logger, a);
}

exports.warn = function () {
    var a = [];
    a.push('warn');
    for (var i = 0; i < arguments.length; i++) {
            a.push(arguments[i]);
    };
    logger.log.apply(logger, a);
}

exports.error = function () {
    var a = [];
    a.push('error');
    for (var i = 0; i < arguments.length; i++) {
            a.push(arguments[i]);
    };
    logger.log.apply(logger, a);
}
