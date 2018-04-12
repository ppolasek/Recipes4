"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var config = require('config');
var logger = require('./logger');

/**
 * my_config.js
 *
 * Manages retrieving the run-time properties of the application server.
 */

/**
 * The port the recipe-server will listen to
 */
exports.nodejs_port = function () {
    if (config.has('recipe-server.nodejs_server.port')) {
        var port = config.get('recipe-server.nodejs_server.port');
        logger.debug('my_config.nodejs_port() port = %s', port);

        return port;
    } else {
        logger.error('my_config.nodejs_port() config property not found: %s', 'recipe-server.nodejs_server.port');

         // TODO throw an error instead
        return 0;
    }
}

/**
 * The database url
 */
exports.db_url = function () {
    if (config.has('recipe-server.mongodb_server.db_url')) {
        var url = config.get('recipe-server.mongodb_server.db_url');
        logger.debug('my_config.db_url() url = %s', url);

        return url;
    } else {
        logger.error('my_config.db_url() config property not found: %s', 'recipe-server.mongodb_server.db_url');

         // TODO throw an error instead
        return null;
    }
}

/**
 * The database name
 */
exports.db_name = function () {
    if (config.has('recipe-server.mongodb_server.db_name')) {
        var name = config.get('recipe-server.mongodb_server.db_name');
        logger.debug('my_config.db_name() name = %s', name);

        return name;
    } else {
        logger.error('my_config.db_name() config property not found: %s', 'recipe-server.mongodb_server.db_name');

         // TODO throw an error instead
        return null;
    }
}
