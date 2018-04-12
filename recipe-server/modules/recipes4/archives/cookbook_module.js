"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var cookbook_mongo_module = require('../../mongo/cookbook_mongo_module.js');
var logger = require('../../logger');

var express = require('express');
var router = express.Router();

module.exports = router;

/**
 * cookbook_module.js
 *
 * Manages all incoming requests for cookbook-related data.
 */

// TODO implement these
//    Future<bool> deleteCookbook(Long cookbookId);

/**
 * Get one cookbook by its 'id'.
 * @param id The cookbook id.
 * @return Returns the Cookbook object or null if not found.
 */
exports.getCookbookById = function (body, responseHandler) {
    logger.debug('cookbook_module.getCookbookById() body[0] = ' + body[0]);

    // type check that 'body' is a primitive number and not something more sinister.
    if (Number.isInteger(body[0]) && body[0] > 0) {
        cookbook_mongo_module.getCookbookById(body[0], responseHandler);
    } else {
        responseHandler(new Error('Not a number: ' + body[0]), null);
    }
}

/**
 * Get all cookbooks from the database
 * @return Returns a list of Cookbook objects
 */
exports.getAllCookbooks = function (body, responseHandler) {
    logger.debug('cookbook_module.getAllCookbooks()');
    cookbook_mongo_module.getAllCookbooks(responseHandler);
}
