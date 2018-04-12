// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var MongoClient = require('mongodb').MongoClient;

// TODO these need to be in config file(s)
var db_url = 'mongodb://localhost:27017';
var db_name = 'recipes4';

//var url = 'mongodb://localhost:27017/recipes4';
var url = db_url + '/' + db_name;

console.log('url = ' + url);

MongoClient.connect(url, function(err, db) {
  // TODO log the error instead and skip the rest
  if (err) throw err;
  console.log('Database created: ' + url);
  db.close();
});
