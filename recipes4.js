"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var logger = require('./recipe-server/modules/logger');
var mongo_setup = require('./recipe-server/modules/mongo/setup');

var http_server = require('./recipe-server/modules/server/http_server_express');
var exec = require('child_process').exec;

/**
 * recipes4.js
 *
 * Default entry point to the server, this will perform the MongoDb setup
 * operations, start the db service request server, and then start the web server.
 */

try {
    logger.info('----------------------------------------------------------------------');
    logger.info('MongoDb setup starting');
    console.log('MongoDb setup starting');

    // Create/prepare the MongoDb database.
    mongo_setup.setup_database(function (err, res) {
        if (err) {
            console.log('Setup failed.');
            logger.error(err);
        } else {
            console.log('MongoDb setup ' + res);
            logger.info('MongoDb setup ' + res);

            // Start the database server
            http_server.start_server(function (err, started) {
                if (started) {
                    logger.info('MongoDb server startup complete');
                    console.log('MongoDb server startup complete');

                    // // start the web server
                    // var childProcess = exec('cd recipe_web; pub serve web --port=58731', function (err, stdout, stderr) {
                    //     if (err) {
                    //         logger.error('Error: ' + err.message);
                    //     }
                    // });

                    logger.info('Web Server started on port 58731');
                    console.log('Web Server started on port 58731');
//                    logger.info('Web Server childProcess pid = ' + childProcess.pid);
//                    console.log('Web Server childProcess pid = ' + childProcess.pid);
//                    console.log('The application may be opened at http://localhost:58731/index.html');
                }
            });
        }
    });
} catch (err) {
    logger.error('caught error: ' + err);
}
