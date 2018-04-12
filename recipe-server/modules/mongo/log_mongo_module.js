"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var mydb = require('./db_module_obs');

/**
 * log_mongo_module.js
 *
 * Handles all Log-related operations against the MongoDb.
 */

/**
 * Log a message.
 * @param message The document to store.
 */
exports.log = function (message) {
    return mydb.insertLogMessage(message);
}
