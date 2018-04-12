// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var MongoClient = require('mongodb').MongoClient;

// TODO these need to be in config file(s)
var db_url = 'mongodb://localhost:27017';
var db_name = 'recipes4';
var recipe_collection_name = 'recipe';
var cookbook_collection_name = 'cookbook';
var tag_collection_name = 'recipe_tag';
var recipe_tag_join_collection_name = 'recipe_tag_join';

//var url = 'mongodb://localhost:27017/recipes4';
var url = db_url + '/' + db_name;

console.log('url = ' + url);

MongoClient.connect(url, function(err, db) {
  // TODO log the error instead and skip the rest
//  console.log(db);
  if (err) throw err;
  console.log('Database created!');

//  _createCollection(db, recipe_collection_name);
  console.log('createCollection() collectionName = ' + tag_collection_name);

  db.createCollection(tag_collection_name, function(err, res) {
    if (err) throw err;
//    console.log(res);
    console.log(tag_collection_name + ' collection created');
    db.close(); // moving close() to here works from the end of the connect() statement
  });
});
