"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

// var logger = require('./logger');

/**
 * recipe_util.js
 *
 * Utility functions.
 */

/**
 * Convert a value to a new Date. The value must be an integer and greater than
 * zero or null will be returned.
 */
exports.convertNumberToDate = function (value) {
    if (Number.isInteger(value) && value <= 0) return null;
    return new Date(value);
}

/**
 * Convert a date to an integer. If the date is not a valid date then null will
 * be returned.
 */
exports.convertDateToNumber = function (some_date) {
//    logger.debug('convertDateToNumber() some_date = ' + some_date);
//    logger.debug('convertDateToNumber() some_date instanceof Date = ' + (some_date instanceof Date));
    if (some_date instanceof Date) {
        return some_date.getTime();
    }
    return null;
}
