"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var my_config = require('../my_config');
var MongoClient = require('mongodb').MongoClient;
var logger = require('../logger');

/**
 * db_module.js
 *
 * This module contains functions to interact directly with the database, such
 * as the standard CRUD operations.
 */

var db_url = null;
var db_name = null
var _view_history = '_view_count_';
var collection_logger = 'log_record';

/**
 * Find documents in a collection.
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to control which records to search for
 * @param mysort The object to control sorting of the records
 * @param count The count of records to retrieve
 * @param responseHandler The function to call when an error occurs or to
 *        complete the call
 */
exports.findWithQuerySortCount = function (collectionName, query, mysort, count, responseHandler) {
    try {
        logger.debug('db_module.findWithQuerySortCount()');

        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        var limitCount;
        if (!Number.isInteger(count)) {
            limitCount = 100;
        } else {
            limitCount = count;
        }

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.findMostViewed() connected to the database');
                logger.debug('db_module.findMostViewed() limitCount = ' + limitCount);

                _find_with_query_sort_count(db, collectionName, query, mysort, limitCount, responseHandler);
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Find the most viewed 'count' number of records from a collection.
 * @param collectionName The name of the collection holding the viewing history
 * @param collectionName The name of the collection to find the most viewed records
 * @param count The number of documents to retrieve from the collection
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.findMostViewed = function (collectionName, collectionForQuery, count, responseHandler) {
    try {
        logger.debug('db_module.findMostViewed() collectionForQuery = ' + collectionForQuery);
        logger.debug('db_module.findMostViewed() count = ' + count);

        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        var limitCount;
        if (!Number.isInteger(count) || count > 10) {
            limitCount = 10;
        } else {
            limitCount = count;
        }

        var counters_key = collectionForQuery + _view_history;
        var query = { _id: new RegExp('^' + counters_key) };

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.findMostViewed() connected to the database');
                logger.debug('db_module.findMostViewed() limitCount = ' + limitCount);

                var mysort = { seq: -1 }; // descending

                _find_with_query_sort_count(db, collectionName, query, mysort, limitCount, function (err, mostViewed) {
                    if (err) {
                        responseHandler(err);
                    } else {
                        if (mostViewed !== null && Array.isArray(mostViewed) &&
                            mostViewed.length > 0) {

                            var ids = [];

                            // the 'mostViewed' only has the id, now we need to retrieve the
                            // actual object
                            for (var i = 0; i < mostViewed.length; i++) {
                                var id = mostViewed[i]._id.substr(counters_key.length);
                                logger.debug('db_module.findMostViewed() id = ' + id);

                                ids.push(parseInt(id));
                            }

                            var query2 = { id: { $in: ids } };
                            logger.debug('db_module.findMostViewed() query2:');
                            logger.debug(query2);

                            var fields = {};

                            _find_with_query_sort_count(db, collectionForQuery, query2, {}, limitCount, function (err, recipelist) {
                                if (err) {
                                    responseHandler(err);
                                } else {
                                    // The results are not in the correct order, so re-order them now
                                    var finalList = [];
                                    if (recipelist != null && recipelist.length > 0) {
                                        for (var i = 0; i < ids.length; i++) {
                                            for (var j = 0; j < recipelist.length; j++) {
                                                if (ids[i] === recipelist[j].id) {
                                                    finalList.push(recipelist[j]);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    responseHandler(null, finalList);
                                }
                            });
                        } else {
                            logger.debug('db_module.findMostViewed() no \'most viewed\' records. returning: []');
                           responseHandler(null, []);
                        }
                    }
                });
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Find the most recently added 'count' number of records from a collection.
 * @param collectionName The name of the collection to search
 * @param count The number of documents to retrieve from the collection
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.findAddedRecently = function (collectionName, count, responseHandler) {
    try {
        logger.debug('db_module.findAddedRecently() count = ' + count);

        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        var limitCount;
        if (!Number.isInteger(count) || count > 10) {
            limitCount = 10;
        } else {
            limitCount = count;
        }

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.findAddedRecently() connected to the database');
                logger.debug('db_module.findAddedRecently() limitCount = ' + limitCount);

                var mysort = { createdOn: -1 }; // descending

                _find_with_query_sort_count(db, collectionName, {}, mysort, limitCount, responseHandler);
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Update one document in a collection.
 * @param collectionName The name of the collection to search
 * @param id The 'id' of the document to retrieve from the collection
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.deleteById = function (collectionName, id, responseHandler) {
    try {
        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.deleteById() connected to the database');
                var query = { "id": id };

                _delete_one(db, collectionName, query, responseHandler);
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Update one document in a collection.
 * @param collectionName The name of the collection to search
 * @param query The query object for searching a MongoDb collection
 * @param newValues The object containing the updates
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.updateOne = function (collectionName, query, newValues, responseHandler) {
    try {
        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.updateOne() connected to the database');

                _update_one(db, collectionName, query, newValues, responseHandler);
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Retrieves a document from the given collection name matching by id,
 * and update the view count history.
 * @param collectionName The name of the collection to search
 * @param id The 'id' of the document to retrieve from the collection
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.findByIdWithHistory = function (collectionName, id, responseHandler) {
    try {
        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.findByIdWithHistory() connected to the database');

                _update_history_sequence(db, collectionName, id, responseHandler);

                var query = { "id": id };
                _find_one(db, collectionName, query, responseHandler);
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Retrieves a document from the given collection name matching by id.
 * @param collectionName The name of the collection to search
 * @param id The 'id' of the document to retrieve from the collection
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.findById = function (collectionName, id, responseHandler) {
    try {
        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.findById() connected to the database');
                var query = { "id": id };

                _find_one(db, collectionName, query, responseHandler);
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Retrieve all documents from the given collection name.
 * @param collectionName The name of the collection to insert a document
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.findAll = function (collectionName, responseHandler) {
    try {
        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.findAll() connected to the database');

                _find_all(db, collectionName, responseHandler);
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Insert one document into the given collection name.
 * @param collectionName The name of the collection to insert a document
 * @param someobj The object to insert into the collection
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.insertOne = function (collectionName, someobj, responseHandler) {
    try {
        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        logger.debug('db_module.insertOne() someobj:');
        logger.debug(someobj);

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                logger.debug('db_module.insertOne() connected to the database');

                _update_id(db, collectionName, someobj, function (err, res) {
                    if (err) {
                        responseHandler(err);
                    } else {
                        _insert_one(db, collectionName, res, responseHandler);
                    }
                });
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Insert a message into the log_record collection.
 * @param message The message to insert into the collection
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.insertLogMessage = function (message, responseHandler) {
    try {
        if (db_url == null || db_name == null) {
            db_url = my_config.db_url();
            db_name = my_config.db_name();
        }

        MongoClient.connect(db_url + '/' + db_name, function(err, db) {
            if (err) {
                responseHandler(err);
            } else {
                db.collection(collection_logger).insertOne(message, function(err, res) {
                    if (err) {
                        // Return the error via the responseHandler so a response may be returned to the user.
                        logger.error('Error caught on \'db_module.insertLogMessage()\': ' + err.message);
                        responseHandler(err);
                    } else {
                        responseHandler(null, null);
                    }
                });
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

// ------------------------------------------------------------------------------------------------
//
// Private functions
//
// ------------------------------------------------------------------------------------------------

/**
 * Find documents in a collection.
 * @param database The database instance where the collection resides
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to control which records to search for
 * @param mysort The object to control sorting of the records
 * @param limitCount The count of records to retrieve
 * @param responseHandler The function to call when an error occurs or to
 *        complete the call
 */
var _find_with_query_sort_count = function (database, collectionName, query, mysort, limitCount, responseHandler) {
    try {
        logger.debug('db_module._find_with_query_sort_count finding document in collection = ' + collectionName);
        logger.debug('db_module._find_with_query_sort_count query:');
        logger.debug(query);
        logger.debug('db_module._find_with_query_sort_count mysort:');
        logger.debug(mysort);
        logger.debug('db_module._find_with_query_sort_count limitCount: ');
        logger.debug(limitCount);

        database.collection(collectionName).find(query).sort(mysort).limit(limitCount).toArray(function(err, result) {
            logger.debug('db_module._find_with_query_sort_count result:');
            logger.debug(result);
            if (err) {
                logger.error('Error caught on \'db_module._find_with_query_sort_count()\': ' + err.message);
                responseHandler(err);
            } else {
                if (result !== 'undefined' && result != null) {
                    responseHandler(null, result);
                } else {
                    responseHandler(null, null);
                }
                database.close();
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}


/**
 * Update one document in a collection.
 * @param database The database instance where the collection resides
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to search the collection with
 * @param newValues The object containing the updates
 * @param responseHandler The function to call when an error occurs or to
 *        complete the call
 */
var _update_one = function (database, collectionName, query, newValues, responseHandler) {
//  var myquery = { address: "Valley 345"};
//  var newValues = { name: 'Mickey', address: 'Canyon 123' };
//
//  db.collection('customers').updateOne(myquery, newValues, function(err, result) {

    try {
        logger.debug('db_module._update_one updating document in collection = ' + collectionName);
        logger.debug('db_module._update_one query:');
        logger.debug(query);
        logger.debug('db_module._update_one newValues:');
        logger.debug(newValues);

        _update_updated_on(newValues);
        _update_version(newValues);

        database.collection(collectionName).updateOne(query, newValues, function(err, result) {
            if (err) {
                logger.error('Error caught on \'db_module._update_one()\': ' + err.message);
                responseHandler(err);
            } else {
                logger.debug('db_module._update_one after update ' + result.result.ok);
//                logger.debug(result);
                if (result.result.ok > 0 && result.result.nModified > 0) {
                    database.close();

                    // on 'success' return the incoming object; the 'result' object _does not_ contain
                    // the object sent (AFAIK)
                    logger.debug('db_module._update_one newValues after update:');
                    logger.debug(newValues);
                    responseHandler(null, newValues);
                } else {
                    database.close();

                    // TODO nothing was updated, now what?
                    responseHandler(null, newValues);
                }
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Perform the collection operation to find one record.
 * @param database The database instance where the collection resides
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to search the collection with
 * @param responseHandler The function to call when an error occurs or to
 *        complete the call
 */
var _delete_one = function (database, collectionName, query, responseHandler) {
    try {
        logger.debug('db_module._delete_one retrieving from collection = ' + collectionName);
        logger.debug('db_module._delete_one query:');
        logger.debug(query);

        database.collection(collectionName).deleteOne(query, function (err, result) {
//            logger.debug(result);
            if (err) {
                logger.error('Error caught on \'db_module._delete_one()\': ' + err.message);
                responseHandler(err);
            } else {
                logger.debug('db_module._delete_one Delete ' + (result.result.ok > 0 ? 'successful' : 'failed'));
                logger.debug('db_module._delete_one Deleted ' + result.result.n + ' documents');

                if (result.result.ok > 0 && result.result.n > 0) {
                    responseHandler(null, true);
                } else {
                    // if no record was deleted then throw an exception instead
                    responseHandler(new Error('No ' + collectionName + ' record found for id: ' + query.id), null);
                }

                database.close();
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Perform the collection operation to find one record.
 * @param database The database instance where the collection resides
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to search the collection with
 * @param responseHandler The function to call when an error occurs or to
 *        complete the call
 */
var _find_one = function (database, collectionName, query, responseHandler) {
    try {
        logger.debug('db_module._find_one retrieving from collection = ' + collectionName);
        logger.debug('db_module._find_one query:');
        logger.debug(query);

        database.collection(collectionName).findOne(query, function (err, result) {
            logger.debug('db_module._find_one result:');
            logger.debug(result);
            if (err) {
                logger.error('Error caught on \'db_module._find_one()\': ' + err.message);
                responseHandler(err);
            } else {
                responseHandler(null, result);
                database.close();
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Perform the collection operation to find all records.
 * @param database The database instance where the collection resides
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param responseHandler The function to call when an error occurs or to
 *        complete the call
 */
var _find_all = function (database, collectionName, responseHandler) {
    try {
        logger.debug('db_module._find_all retrieving all from collection = ' + collectionName);
        database.collection(collectionName).find().toArray(function (err, result) {
            if (err) {
                logger.error('Error caught on \'db_module._find_all()\': ' + err.message);
                responseHandler(err);
            } else {
                responseHandler(null, result);
                database.close();
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Update the viewing history for a collection and specific id.
 * @param database The database instance where the collection resides
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param id The 'id' of the record to be incremented.
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
var _update_history_sequence = function(database, collectionName, id, responseHandler) {
    try {
        logger.debug('db_module._update_history_sequence() getting a new id value');
        database.collection('counters').findAndModify(
            { "_id": collectionName + _view_history + id }, // query object to locate the object to modify
            [["_id", "asc"]], // sort array
            { $inc: { "seq": 1 } }, // document (object) with the fields/vals to be updated
            { new: true, upsert: true }, // options to perform an upsert operation
            function (err, doc) {
                if (err) {
                    responseHandler(err);
                } else {
                    logger.debug('db_module._update_history_sequence() doc.value.seq = ' + doc.value.seq);
//                    logger.debug(doc);
//{ value: { _id: 'recipe_view_count_13', seq: 1 },
//  lastErrorObject:
//   { updatedExisting: false,
//     n: 1,
//     upserted: 'recipe_view_count_13' },
//  ok: 1 }

//                    logger.debug('db_module._update_history_sequence() it worked - done');
//                    responseHandler(null, someobj);
                }
            });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Update the 'id' and '_id' property of 'someobj'.
 * @param database The database instance where the collection resides
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param someobj The object to update with the new 'id' and '_id'
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
var _update_id = function(database, collectionName, someobj, responseHandler) {
    try {
        if (!('id' in someobj) || someobj.id == null || someobj.id < 0) {
            logger.debug('db_module._update_id() getting a new id value');
            database.collection('counters').findAndModify(
                    { "_id": collectionName + '_id' }, // query object to locate the object to modify
                    [["_id", "asc"]], // sort array
                    { $inc: { "seq": 1 } }, // document (object) with the fields/vals to be updated
                    { new: true, upsert: true }, // options to perform an upsert operation
                    function (err, doc) {
                        if (err) {
                            responseHandler(err);
                        } else {
                            logger.debug('db_module._update_id() doc.value.seq = ' + doc.value.seq);
                            logger.debug(doc);
                            someobj.id = doc.value.seq;

                            // also use it for the _id property
                            someobj._id = doc.value.seq;

                            logger.debug('db_module._update_id() it worked - done');
                            responseHandler(null, someobj);
                        }
                    });
        }
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Perform the operation to insert the record.
 * @param database The database instance where the collection resides
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param someobj The object to update with the new 'id' and '_id'
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
var _insert_one = function (database, collectionName, someobj, responseHandler) {
    try {
        logger.debug('db_module._insert_one() someobj:');
        logger.debug(someobj);

        _update_created_on(someobj);
        _update_updated_on(someobj);
        someobj.version = 0;

        database.collection(collectionName).insertOne(someobj, function(err, res) {
            if (err) {
                // Return the error via the responseHandler so a response may be returned to the user.
                logger.error('Error caught on \'db_module._insert_one()\': ' + err.message);
                responseHandler(err);
            } else {
                // logger.debug('db_module._insert_one() ' + res.insertedCount + ' document inserted');
                // logger.debug('db_module._insert_one() returning:');
                // logger.debug(res.ops[0]);
                database.close();
                responseHandler(null, res.ops[0]);
            }
        });
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Update the 'updatedOn' date.
 */
var _update_updated_on = function (obj) {
    if ('updatedOn' in obj) {
        obj.updatedOn = new Date();
    }
}

/**
 * Update the 'createdOn' date.
 */
var _update_created_on = function (obj) {
    if ('createdOn' in obj) {
        obj.createdOn = new Date();
    }
}

/**
 * Update the 'version' count.
 */
var _update_version = function (obj) {
    if ('version' in obj && Number.isInteger(obj.version)) {
        obj.version = obj.version + 1;
    } else {
        obj.version = 0;
    }
}
