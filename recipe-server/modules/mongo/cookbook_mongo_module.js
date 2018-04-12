"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var mydb = require('./db_module_obs');
var logger = require('../logger');

/**
 * cookbook_mongo_module.js
 *
 * Handles all Cookbook-related operations against the MongoDb.
 */
// TODO implement these
//    Future<bool> deleteCookbook(Long cookbookId);

var collection_cookbook = 'cookbook';

/**
 * Retrieve one cookbook by its 'id'.
 * @param id The Id of the cookbook to retrieve if found, this will return null
 *        if not found.
 */
exports.getCookbookById = function (id) {
    return mydb.findById(collection_cookbook, id);
}

/**
 * Retrieve all cookbooks.
 */
exports.getAllCookbooks = function () {
    logger.debug('cookbook_mongo_module.getAllCookbooks()');
    return mydb.findAll(collection_cookbook);
}

/**
 * Saves a new cookbook to the database.
 * @param cookbook The Cookbook object to insert
 */
exports.saveCookbook = function (cookbook) {
    logger.debug('cookbook_mongo_module.saveCookbook() cookbook:');
    logger.debug(cookbook);
    return mydb.insertOne(collection_cookbook, cookbook);
}
