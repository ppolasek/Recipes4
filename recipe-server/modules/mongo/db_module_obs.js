"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var my_config = require('../my_config');
var MongoClient = require('mongodb').MongoClient;
var logger = require('../logger');
var Rx = require('rxjs/Rx');

/**
 * db_module_obs.js
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
 */
exports.findWithQuerySortCount = function (collectionName, query, mysort, count) {
    logger.debug('db_module_obs.findWithQuerySortCount()');

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

    var client;
    return _getMongoClient(db_url)
        .do(function (theclient) {
            logger.debug('db_module_obs.findWithQuerySortCount() got mongo client. theclient = ' + theclient.toString());
            client = theclient;
        })
        .flatMap(function (_) {
            logger.debug('db_module_obs.findWithQuerySortCount() connected to the database');
            logger.debug('db_module_obs.findWithQuerySortCount() limitCount = ' + limitCount);

            return _find_with_query_sort_count(client, collectionName, query, mysort, limitCount);
        });
}

/**
 * Find the most viewed 'count' number of records from a collection.
 * @param collectionName The name of the collection holding the viewing history
 * @param collectionName The name of the collection to find the most viewed records
 * @param count The number of documents to retrieve from the collection
 */
exports.findMostViewed = function (collectionName, collectionForQuery, count) {
    logger.debug('db_module_obs.findMostViewed() collectionForQuery = ' + collectionForQuery);
    logger.debug('db_module_obs.findMostViewed() count = ' + count);

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
    var ids = [];
    var client;

    return _getMongoClient(db_url)
        .do(function (theclient) {
            logger.debug('db_module_obs.findWithQuerySortCount() got mongo client. theclient = ' + theclient.toString());
            client = theclient;
        })
        .flatMap(function (_) {
            logger.debug('db_module_obs.findMostViewed() connected to the database');
            logger.debug('db_module_obs.findMostViewed() limitCount = ' + limitCount);

            var mysort = { seq: -1 }; // descending

            return _find_with_query_sort_count(client, collectionName, query, mysort, limitCount);
        })
        .flatMap(function (mostViewed) {
            if (mostViewed === null || !Array.isArray(mostViewed) || mostViewed.length === 0) {
                logger.debug('db_module_obs.findMostViewed() no \'most viewed\' records. returning: []');
                return new Rx.Observable.of([]);
            } else {
                // the 'mostViewed' only has the id, now we need to retrieve the
                // actual object
                for (var i = 0; i < mostViewed.length; i++) {
                    var id = mostViewed[i]._id.substr(counters_key.length);
                    logger.debug('db_module_obs.findMostViewed() id = ' + id);

                    ids.push(parseInt(id));
                }

                var query2 = { id: { $in: ids } };
                logger.debug('db_module_obs.findMostViewed() query2:');
                logger.debug(query2);

                var fields = {};

                return _find_with_query_sort_count(client, collectionForQuery, query2, {}, limitCount);
            }
        })
        .flatMap(function (recipelist) {
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
            logger.debug('db_module_obs.findMostViewed() done. finalList:');
            logger.debug(finalList);
            return new Rx.Observable.of(finalList);
        });
}

/**
 * Find the most recently added 'count' number of records from a collection.
 * @param collectionName The name of the collection to search
 * @param count The number of documents to retrieve from the collection
 */
exports.findAddedRecently = function (collectionName, count) {
    logger.debug('db_module_obs.findAddedRecently() count = ' + count);

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

    var client;
    return _getMongoClient(db_url)
        .flatMap(function (theclient) {
            logger.debug('db_module_obs.deleteById() got mongo client. theclient = ' + theclient.toString());
            client = theclient;

            logger.debug('db_module_obs.findAddedRecently() connected to the database');
            logger.debug('db_module_obs.findAddedRecently() limitCount = ' + limitCount);

            var mysort = { createdOn: -1 }; // descending

            return _find_with_query_sort_count(client, collectionName, {}, mysort, limitCount);
        });
}

/**
 * Delete one document in a collection.
 * @param collectionName The name of the collection to search
 * @param id The 'id' of the document to retrieve from the collection
 */
exports.deleteById = function (collectionName, id) {
    if (db_url == null || db_name == null) {
        db_url = my_config.db_url();
        db_name = my_config.db_name();
    }

    var client;
    return _getMongoClient(db_url)
        .do(function (theclient) {
            logger.debug('db_module_obs.deleteById() got mongo client. theclient = ' + theclient.toString());
            client = theclient;
        })
        .flatMap(function (_) {
            logger.debug('db_module_obs.deleteById() connected to the database');
            var query = { "id": id };

            return _delete_one(client, collectionName, query);
        });
}

/**
 * Update one document in a collection.
 * @param collectionName The name of the collection to search
 * @param query The query object for searching a MongoDb collection
 * @param newValues The object containing the updates
 */
exports.updateOne = function (collectionName, query, newValues) {
    if (db_url == null || db_name == null) {
        db_url = my_config.db_url();
        db_name = my_config.db_name();
    }

    var client;
    return _getMongoClient(db_url)
        .do(function (theclient) {
            logger.debug('db_module_obs.updateOne() got mongo client. theclient = ' + theclient.toString());
            client = theclient;
        })
        .flatMap(function (_) {
            logger.debug('db_module_obs.updateOne() connected to the database');

            return _update_one(client, collectionName, query, newValues);
        });
}

/**
 * Retrieves a document from the given collection name matching by id,
 * and update the view count history.
 * @param collectionName The name of the collection to search
 * @param id The 'id' of the document to retrieve from the collection
 */
exports.findByIdWithHistory = function (collectionName, id) {
    if (db_url == null || db_name == null) {
        db_url = my_config.db_url();
        db_name = my_config.db_name();
    }

    var client;
    logger.debug('db_module_obs.findByIdWithHistory() getting mongo client');
    return _getMongoClient(db_url)
        .flatMap(function (theclient) {
            logger.debug('db_module_obs.findByIdWithHistory() got mongo client. theclient = ' + theclient.toString());
            client = theclient;

            return _update_history_sequence(client, collectionName, id);
        })
        .flatMap(function (_) {
            var query = { "id": id };
            logger.debug('db_module_obs.findByIdWithHistory() finding by query:');
            logger.debug(query);
            return _find_one(client, collectionName, query);
        });
}

/**
 * Retrieves a document from the given collection name matching by id.
 * @param collectionName The name of the collection to search
 * @param id The 'id' of the document to retrieve from the collection
 */
exports.findById = function (collectionName, id) {
    if (db_url == null || db_name == null) {
        db_url = my_config.db_url();
        db_name = my_config.db_name();
    }

    var client;
    logger.debug('db_module_obs.findById() getting mongo client');
    return _getMongoClient(db_url)
        .do(function (theclient) {
            logger.debug('db_module_obs.findById() got mongo client. theclient = ' + theclient.toString());
            client = theclient;
        })
        .flatMap(function (_) {
            logger.debug('db_module_obs.findById() calling _find_one');
            var query = { "id": id };

            return _find_one(client, collectionName, query);
        });
}

/**
 * Retrieve all documents from the given collection name.
 * @param collectionName The name of the collection to insert a document
 */
exports.findAll = function (collectionName) {
    if (db_url == null || db_name == null) {
        db_url = my_config.db_url();
        db_name = my_config.db_name();
    }

    var client;
    return _getMongoClient(db_url)
        .do(function (theclient) {
            client = theclient;
        })
        .flatMap(function (_) {
            return _find_all(client, collectionName);
        });
}

/**
 * Insert one document into the given collection name.
 * @param collectionName The name of the collection to insert a document
 * @param someobj The object to insert into the collection
 */
exports.insertOne = function (collectionName, someobj) {
    if (db_url == null || db_name == null) {
        db_url = my_config.db_url();
        db_name = my_config.db_name();
    }

    logger.debug('db_module_obs.insertOne() collectionName = %s, someobj:', collectionName);
    logger.debug(someobj);

    var client;
    return _getMongoClient(db_url)
        .do(function (theclient) {
            logger.debug('db_module_obs.insertOne() theclient = ' + theclient);
            client = theclient;
        })
        .flatMap(function (_) {
            return _update_id(client, collectionName, someobj);
        })
        .flatMap(function (updatedObj) {
            return _insert_one(client, collectionName, updatedObj);
        });
}

/**
 * Insert a message into the log_record collection.
 * @param message The message to insert into the collection
 */
exports.insertLogMessage = function (message) {
    // logger.debug('db_module_obs.insertLogMessage() message:');
    // logger.debug(message);

    if (db_url == null || db_name == null) {
        db_url = my_config.db_url();
        db_name = my_config.db_name();
    }

    var client;
    // logger.debug('db_module_obs.insertLogMessage() getting mongo client');
    return _getMongoClient(db_url, false)
        .do(function (theclient) {
            // logger.debug('db_module_obs.insertLogMessage() got mongo client. theclient = ' + theclient.toString());
            client = theclient;
        })
        .flatMap(function (_) {
            // logger.debug('db_module_obs.insertLogMessage() connecting to db');
            // logger.debug(client);
            return _connect_to_db(client, db_name, false);
        })
        .flatMap(function (db) {
            // logger.debug('db_module_obs.insertLogMessage() connected to db');
            // logger.debug(db);
            return Rx.Observable.create(function (observer) {
                // logger.debug('db_module_obs.insertLogMessage() inserting a record');
                db.collection(collection_logger).insertOne(message, function (err, res) {
                    if (err) {
                        logger.error('Error caught on \'db_module_obs.insertLogMessage()\': ' + err.message);
                        observer.error(err);
                    } else {
                        // logger.debug('db_module_obs.insertLogMessage() inserted a record');
                        observer.next(null, null);
                        client.close();
                    }
                });
            })
        });
}

// ------------------------------------------------------------------------------------------------
//
// Private functions
//
// ------------------------------------------------------------------------------------------------

/**
 * Connect to the MongoClient.
 * @param url The database URL to connect to.
 * @param logOutput Whether to log the output from this function.
 */
    var _getMongoClient = function (url, logOutput) {
    logOutput = typeof logOutput !== 'undefined' ? logOutput : true;
    if (logOutput) logger.debug('db_module_obs._getMongoClient() url: ' + url);
    return Rx.Observable.create(function (observer) {
        new MongoClient(url).connect(function (err, client) {
            if (err) {
                observer.error(err);
            } else {
                if (logOutput) logger.debug('db_module_obs._getMongoClient() client: ' + client);
                observer.next(client);
            }
        });
        // publish():
        // Returns a ConnectableObservable, which is a variety of Observable
        // that waits until its connect method is called before it begins
        // emitting items to those Observers that have subscribed to it.
        
        // refCount():
        // ConnectableObservable has a special operator, refCount. When
        // called, it returns an Observable, which will count the number of
        // consumers subscribed to it and keep ConnectableObservable
        // connected as long as there is at least one consumer.
    }).publish().refCount();
}

/**
 * Connect to the database, creating it if needed.
 * @param client The mongo client instance.
 * @param dbname The database name to connect to.
 * @param logOutput Whether to log the output from this function.
 */
var _connect_to_db = function (client, dbname, logOutput) {
    logOutput = typeof logOutput !== 'undefined' ? logOutput : true;
    return Rx.Observable.create(function (observer) {
        try {
//            logger.debug('db_module_obs._connect_to_db() dbname = ' + dbname + ', client: ' + client);
            // logger.debug('db_module_obs._connect_to_db() client.runtimeType: ' + client.runtimeType);
            var db = client.db(dbname);
            // logger.debug('db_module_obs._connect_to_db() db: ' + db);
            observer.next(db);
        } catch (err) {
            logger.error('db_module_obs caught error: ' + err);
            observer.error(err);
        }
        // publish():
        // Returns a ConnectableObservable, which is a variety of Observable
        // that waits until its connect method is called before it begins
        // emitting items to those Observers that have subscribed to it.

        // refCount():
        // ConnectableObservable has a special operator, refCount. When
        // called, it returns an Observable, which will count the number of
        // consumers subscribed to it and keep ConnectableObservable
        // connected as long as there is at least one consumer.
    }).publish().refCount();
}


/**
 * Find documents in a collection.
 * @param client The MongoClient instance
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to control which records to search for
 * @param mysort The object to control sorting of the records
 * @param limitCount The count of records to retrieve
 */
var _find_with_query_sort_count = function (client, collectionName, query, mysort, limitCount) {
    logger.debug('db_module_obs._find_with_query_sort_count finding document in collection = ' + collectionName);
    logger.debug('db_module_obs._find_with_query_sort_count query:');
    logger.debug(query);
    logger.debug('db_module_obs._find_with_query_sort_count mysort:');
    logger.debug(mysort);
    logger.debug('db_module_obs._find_with_query_sort_count limitCount: ');
    logger.debug(limitCount);

    return _connect_to_db(client, db_name)
        .flatMap(function (database) {
            return Rx.Observable.create(function (observer) {
                database.collection(collectionName).find(query).sort(mysort).limit(limitCount).toArray(function(err, result) {
                    logger.debug('db_module_obs._find_with_query_sort_count result:');
                    logger.debug(result);
                    if (err) {
                        logger.error('Error caught on \'db_module_obs._find_with_query_sort_count()\': ' + err.message);
                        observer.error(err);
                    } else {
                        if (result !== 'undefined' && result != null) {
                            observer.next(result);
                        } else {
                            observer.next(null);
                        }
                    }
                    client.close();
                });
            });
        });
}

/**
 * Update one document in a collection.
 * @param client The MongoClient instance
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to search the collection with
 * @param newValues The object containing the updates
 */
var _update_one = function (client, collectionName, query, newValues) {
//  var myquery = { address: "Valley 345"};
//  var newValues = { name: 'Mickey', address: 'Canyon 123' };
//
//  db.collection('customers').updateOne(myquery, newValues, function(err, result) {

    logger.debug('db_module_obs._update_one updating document in collection = ' + collectionName);
    logger.debug('db_module_obs._update_one query:');
    logger.debug(query);
    logger.debug('db_module_obs._update_one newValues:');
    logger.debug(newValues);

    _update_updated_on(newValues);
    _update_version(newValues);

    return _connect_to_db(client, db_name)
        .flatMap(function (database) {
            return Rx.Observable.create(function (observer) {
                database.collection(collectionName).replaceOne(query, newValues, function(err, result) {
                    if (err) {
                        logger.error('Error caught on \'db_module_obs._update_one()\': ' + err.message);
                        observer.error(err);
                    } else {
                        logger.debug('db_module_obs._update_one after update ' + result.result.ok.toString());
    //                    logger.debug(result);
                        logger.debug('db_module_obs._update_one newValues after update:');
                        logger.debug(newValues);
                        observer.next(newValues);
                    }
                    client.close();
                });
            });
        });
}

/**
 * Perform the collection operation to find one record.
 * @param client The MongoClient instance
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to search the collection with
 */
var _delete_one = function (client, collectionName, query) {
    logger.debug('db_module_obs._delete_one retrieving from collection = ' + collectionName);
    logger.debug('db_module_obs._delete_one query:');
    logger.debug(query);

    return _connect_to_db(client, db_name)
        .flatMap(function (database) {
            return Rx.Observable.create(function (observer) {
                database.collection(collectionName).deleteOne(query, function (err, result) {
     //            logger.debug(result);
                    if (err) {
                        logger.error('Error caught on \'db_module_obs._delete_one()\': ' + err.message);
                        observer.error(err);
                    } else {
                        logger.debug('db_module_obs._delete_one Delete ' + (result.result.ok > 0 ? 'successful' : 'failed'));
                        logger.debug('db_module_obs._delete_one Deleted ' + result.result.n + ' documents');

                        if (result.result.ok > 0 && result.result.n > 0) {
                            observer.next(true);
                        } else {
                            // if no record was deleted then throw an exception instead
                            observer.error(new Error('No ' + collectionName + ' record found for id: ' + query.id), null);
                        }
                    }
                    client.close();
                });
            });
        });
}

/**
 * Perform the collection operation to find one record.
 * @param client The MongoClient instance
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param query The query object to search the collection with
 */
var _find_one = function (client, collectionName, query) {
    logger.debug('db_module_obs._find_one retrieving from collection = ' + collectionName);
    logger.debug('db_module_obs._find_one query:');
    logger.debug(query);

    return _connect_to_db(client, db_name)
        .flatMap(function (database) {
            return Rx.Observable.create(function (observer) {
                database.collection(collectionName).findOne(query, function (err, result) {
                    logger.debug('db_module_obs._find_one result:');
                    logger.debug(result);
                    if (err) {
                        logger.error('Error caught on \'db_module_obs._find_one()\': ' + err.message);
                        observer.err(err);
                    } else {
                        observer.next(result);
                    }
                    client.close();
                });
        });
    });
}

/**
 * Perform the collection operation to find all records.
 * @param client The MongoClient instance
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 */
var _find_all = function (client, collectionName) {
    logger.debug('db_module_obs._find_all client = ' + client);
    logger.debug('db_module_obs._find_all retrieving all from collection = ' + collectionName);
    
    return _connect_to_db(client, db_name)
        .flatMap(function (database) {
            return Rx.Observable.create(function (observer) {
                database.collection(collectionName).find().toArray(function (err, result) {
                    if (err) {
                        logger.error('Error caught on \'db_module_obs._find_all()\': ' + err.message);
                        observer.err(err);
                    } else {
                        observer.next(result);
                    }
                    client.close();
                });
        });
    });
}

/**
 * Update the viewing history for a collection and specific id. This does not
 * return any value but may throw an exception if one occurs.
 * @param client The MongoClient instance
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param id The 'id' of the record to be incremented.
 */
var _update_history_sequence = function(client, collectionName, id) {
    logger.debug('db_module_obs._update_history_sequence() getting a new id value');

    return _connect_to_db(client, db_name)
        .flatMap(function (database) {
            return Rx.Observable.create(function (observer) {
                database.collection('counters').findOneAndUpdate(
                    { "_id": collectionName + _view_history + id }, // query object to locate the object to modify
                    // [["_id", "asc"]], // sort array
                    { $inc: { "seq": 1 } }, // document (object) with the fields/vals to be updated
                    {returnOriginal: false, upsert: true }, // options to perform an upsert operation
                    function (err, result) {
                        if (err) {
                            observer.error(err);
                        } else {
                            logger.debug('db_module_obs._update_history_sequence() result.value.seq = ' + result.value.seq);
                            logger.debug('db_module_obs._update_history_sequence() result.ok = ' + result.ok);
                            logger.debug(result);
//{ value: { _id: 'recipe_view_count_13', seq: 1 },
//  lastErrorObject:
//   { updatedExisting: false,
//     n: 1,
//     upserted: 'recipe_view_count_13' },
//  ok: 1 }

                           // logger.debug('db_module_obs._update_history_sequence() it worked - done');
                           // observer.next(someobj);
                            observer.next();
                        }
                });
            });
        });
}

/**
 * Update the 'id' and '_id' property of 'someobj'.
 * @param client The MongoClient instance
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param someobj The object to update with the new 'id' and '_id'
 */
var _update_id = function(client, collectionName, someobj) {
    if (!('id' in someobj) || someobj.id == null || someobj.id < 0) {
        logger.debug('db_module_obs._update_id() getting a new id value');

        return _connect_to_db(client, db_name)
            .flatMap(function (database) {
                return Rx.Observable.create(function (observer) {
                    database.collection('counters').findAndModify(
                        { "_id": collectionName + '_id' }, // query object to locate the object to modify
                        [["_id", "asc"]], // sort array
                        { $inc: { "seq": 1 } }, // document (object) with the fields/vals to be updated
                        { new: true, upsert: true }, // options to perform an upsert operation
                        function (err, doc) {
                            if (err) {
                                observer.error(err);
                            } else {
                                logger.debug('db_module_obs._update_id() doc.value.seq = ' + doc.value.seq);
                                logger.debug(doc);
                                someobj.id = doc.value.seq;

                                // also use it for the _id property
                                someobj._id = doc.value.seq;

                                logger.debug('db_module_obs._update_id() it worked - done');
                                observer.next(someobj);
                            }
                    });
                });
            });
    } else {
        return Rx.Observable.of(someobj);
    }
}

/**
 * Perform the operation to insert the record.
 * @param client The MongoClient instance
 * @param collectionName The name of the collection where the 'someobj' will be
 *        inserted
 * @param someobj The object to update with the new 'id' and '_id'
 */
var _insert_one = function (client, collectionName, someobj) {
    logger.debug('db_module_obs._insert_one() someobj:');
    logger.debug(someobj);

    _update_created_on(someobj);
    _update_updated_on(someobj);
    someobj.version = 0;

    return _connect_to_db(client, db_name)
        .flatMap(function (database) {
            return Rx.Observable.create(function (observer) {
                database.collection(collectionName).insertOne(someobj, function(err, res) {
                    if (err) {
                        logger.error('Error caught on \'db_module_obs._insert_one()\': ' + err.message);
                        observer.error(err);
                    } else {
                        // logger.debug('db_module_obs._insert_one() ' + res.insertedCount + ' document inserted');
                        // logger.debug('db_module_obs._insert_one() returning:');
                        // logger.debug(res.ops[0]);
                        logger.debug('db_module_obs._insert_one() object inserted');
                        observer.next(res.ops[0]);
                    }
                    client.close();
                });
            });
        });
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
