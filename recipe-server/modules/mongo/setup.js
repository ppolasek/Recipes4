"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var MongoClient = require('mongodb').MongoClient,
    Admin = require('mongodb').Admin;
var logger = require('../logger');
var my_config = require('../my_config');

/**
 * setup.js
 *
 * Performs MongoDb database setup, including creating the database,
 * collections, indexes, and initial sequence values.
 */

var id_suffix = '_id';
var collection_recipe = 'recipe';
var collection_cookbook = 'cookbook';
var collection_tag = 'recipe_tag';
var collection_counters = 'counters';
var collection_logger = 'log_record';

/**
 * Create the database, collections, indexes, and initial values.
 * @param callback The function to invoke with either the error or when processing is complete.
 */
exports.setup_database = function (callback) {
    var database;
    try {
        var db_url = my_config.db_url(); // 'mongodb://localhost:27017';
        var db_name = my_config.db_name(); // 'recipes4';

//        _connect_to_db(db_url + '/' + db_name, function(err, db) {
        _connect_to_client(db_url, function(err, client) {
            if (err) {
                callback(err);
            } else {
                logger.debug('setup_database() client: ' + client);
                var db = client.db(db_name);
                logger.debug('setup_database() db: ' + db);

                database = db;

                var adminDb = db.admin();

                adminDb.serverInfo( function (err, serverinfo) {
                    if (err) {
                        callback(err);
                    } else if (serverinfo.ok === 1) {
                        logger.info('MongoDb server version ' + serverinfo.version);
                        console.log('MongoDb server version ' + serverinfo.version);
                    } else {
                        logger.info('MongoDb bad status from server: ' + serverinfo.ok);
                        console.log('MongoDb bad status from server: ' + serverinfo.ok);
                    }
                    // serverInfo() outputs this:
                    // { version: '3.0.15',
                    //     gitVersion: 'b8ff507269c382bc100fc52f75f48d54cd42ec3b',
                    //     OpenSSLVersion: 'OpenSSL 1.0.1e-fips 11 Feb 2013',
                    //     sysInfo: 'Linux ip-10-225-79-249 3.10.0-327.22.2.el7.x86_64 #1 SMP Thu Jun 9 10:09:10 EDT 2016 x86_64 BOOST_LIB_VERSION=1_49',
                    //     versionArray: [ 3, 0, 15, 0 ],
                    //     loaderFlags: '',
                    //     compilerFlags: '-Wnon-virtual-dtor -Woverloaded-virtual -std=c++11 -fno-omit-frame-pointer -fPIC -fno-strict-aliasing -ggdb -pthread -Wall -Wsign-compare -Wno-unknown-pragmas -Winvalid-pch -pipe -Werror -O3 -Wno-unused-local-typedefs -Wno-unused-function -Wno-deprecated-declarations -Wno-unused-but-set-variable -Wno-missing-braces -fno-builtin-memcmp -std=c99',
                    //     allocator: 'tcmalloc',
                    //     javascriptEngine: 'V8',
                    //     bits: 64,
                    //     debug: false,
                    //     maxBsonObjectSize: 16777216,
                    //     ok: 1 }
                });

                var collections = [
                    collection_recipe,
                    collection_cookbook,
                    collection_tag,
                    collection_counters,
                    collection_logger
                ];
                var collection_count = collections.length;

                collections.forEach(function(collectionName) {
                    _create_collection(db, collectionName, function (err, new_collection) {
                        if (err) {
                            client.close();
                            callback(err);
                        } else {
                            _create_indexes(db, new_collection, function (err, success) {
                                if (err) {
                                    client.close();
                                    callback(err);
                                } else {
                                    if (success) {
                                        collection_count--;
                                        logger.debug('collection_count = ' + collection_count);
                                        if (collection_count == 0) {
                                            client.close();
                                            logger.info('Database setup complete.');
                                            callback(null, 'complete');
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });
    } catch (err) {
        logger.error('caught error: ' + err);
        if (database !== 'undefined' && database != null) {
           database.close();
        }
        callback(err);
    }
}

/**
 * Connect to the database, creating it if needed.
 * @param url The database URL to connect to.
 * @param callback The function to invoke with either the error or the database instance.
 */
var _connect_to_client = function (url, callback) {
    try {
        logger.debug('_connect_to_client() url: ' + url);
//        MongoClient.connect(url, function (err, db) {
        new MongoClient(url).connect(function (err, client) {
            if (err) {
                callback(err);
            } else {
                callback(null, client);
            }
        });
    } catch (err) {
      logger.error('caught error: ' + err);
      callback(err);
    }
}

/**
 * Create the specified collection name.
 * @param database The database instance on which the collections are created.
 * @param collectionName The name of the collection to create.
 * @param callback The function to invoke with either the error or the collection instance.
 */
var _create_collection = function (database, collectionName, callback) {
    try {
        logger.debug('Processing collection: ' + collectionName);
        database.createCollection(collectionName, function (err, collection) {
            if (err) {
                callback(err);
            } else {
                logger.debug('Created collection: ' + collectionName);
                callback(null, collection);
            }
        });
    } catch (err) {
      logger.error('caught error: ' + err);
      callback(err);
    }
}

/**
 * Create the required indexes or initial records in the collections.
 * @param database The database instance on which the collections were created.
 * @param collection The collection which was just created.
 * @param callback The function to invoke with either the error or the final result.
 */
var _create_indexes = function (database, collection, callback) {
    try {

        if (collection.collectionName == collection_counters) {
            var query = { _id : collection_cookbook + id_suffix };
            database.collection(collection.collectionName).find(query).toArray(function(err, result) {
// console.log(result); // output: [ { _id: 'cookbook_id', seq: 0 } ] if found, [] when not found
                if (err) {
                    callback(err);
                } else {
                    if (result.length == 0) {
                        logger.info('_create_indexes() ' + collection_counters + ' sequences did not exist - creating');
                        // insert initial counter values
                        database.collection(collection.collectionName).insertMany(
                            [
                                { _id : collection_cookbook        + id_suffix, seq: 0 },
                                { _id : collection_recipe          + id_suffix, seq: 0 },
                                { _id : collection_tag             + id_suffix, seq: 0 },
//                                { _id : collection_recipe_tag_join + id_suffix, seq: 0 }
                            ],
                            function (err, res) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null, true);
                                }
                            }
                        );
                    } else {
                        logger.info('_create_indexes() ' + collection_counters + ' sequences already exist - skipping');
                        callback(null, true);
                    }
                }
            });
        } else {
            logger.debug('Creating indexes for collection: ' + collection.collectionName);

            if (collection_tag == collection.collectionName) {
                _check_keys(database, collection, ['id', 'tagName'], callback);
            } else if (collection_recipe == collection.collectionName) {
                _check_keys(database, collection, ['id', 'recipeName'], callback);
            } else if (collection_cookbook == collection.collectionName) {
                _check_keys(database, collection, ['id', 'name'], callback);
            // } else if (collection_recipe_tag_join == collection.collectionName) {
            //     // the join table has a compound key
            //     _check_keys(database, collection, ['id', ['recipeId', 'recipeTagId']], callback);
            } else {
                callback(null, true);
            }
        }
    } catch (err) {
      logger.error('caught error: ' + err);
      callback(err);
    }
}

/**
 * Determine whether the specified key is missing from the index.
 * @param database The database instance
 * @param collection The collection instance
 * @param theKeys The array of keys to look for in the index. If they don't
 *        exist they will be created
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
var _check_keys = function (database, collection, theKeys, callback) {
    collection.listIndexes().toArray(function (err, result) {
        if (err) {
            callback(err);
        } else {
            if (result !== 'undefined' && result != null && result.length > 0) {
                for (var j = 0; j < theKeys.length; j++) {
                    var found = false;
                    for (var i = 0; i < result.length; i++) {
//                        logger.debug('_is_key_missing() result[i].key = ' + result[i].key);
//                        logger.debug('_is_key_missing() result[i].key.id = ' + result[i].key.id);
//                        logger.debug('_is_key_missing() Object.keys(result[i].key) = ' + Object.keys(result[i].key)); // tagName, id, _id
                        if (Object.keys(result[i].key) == theKeys[j]) {
                            logger.info('  ' + collection.collectionName + ': key already exists: ' + theKeys[j]);
                            found = true;
                        }
                    }

                    if (!found) {
                        var collectionKey = {};
                        if (typeof theKeys[j] == 'string') {
                            collectionKey[theKeys[j]] = 1;
                            logger.info('  ' + collection.collectionName + ': creating key: ');
                            logger.info(collectionKey);
                            database.collection(collection.collectionName).createIndex( collectionKey, { unique : true }, function (err, res) {
                                if (err) {
                                    callback(err);
                                }
                            });
                        } else if (Array.isArray(theKeys[j])) {
                            // this will be a compound key. Example: db.collection.createIndex( { a: 1, b: 1 }, { unique: true } )
                            for (var k = 0; k < theKeys[j].length; k++) {
                                collectionKey[theKeys[j][k]] = 1;
                            }
                            logger.info('  ' + collection.collectionName + ': creating compound key:');
                            logger.info(collectionKey);
                            database.collection(collection.collectionName).createIndex( collectionKey, { unique : true }, function (err, res) {
                                if (err) {
                                    callback(err);
                                }
                            });
                        }
                    }
                }
            }
            callback(null, true);
        }
    });
}
