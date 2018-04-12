"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var log_mongo_module = require('../../mongo/log_mongo_module.js');
var logger = require('../../logger');

/**
 * log_module.js
 *
 * Manages all incoming log requests.
 */

/**
 * Store the log record.
 */
exports.logger = function (body, responseHandler) {
    log_mongo_module.log(body, responseHandler);
}
