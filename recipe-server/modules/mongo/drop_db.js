"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var my_config = require('../my_config');
var MongoClient = require('mongodb').MongoClient;
var logger = require('../logger');

/**
 * drop_db.js
 *
 * Drops the database from Mongo.
 */

var db_url;
var db_name;

if (db_url == null || db_name == null) {
    db_url = my_config.db_url();
    db_name = my_config.db_name();
}

MongoClient.connect(db_url + '/' + db_name, function(err, db) {
  if (err) {
    logger.error(err);
  } else {
      db.dropDatabase(function (err, res) {
          if (err) {
            logger.error(err);
          } else {
            logger.debug('database dropped: ' + db_url + '/' + db_name);
//            logger.debug(res);
            db.close();
          }
      });
  }
});
