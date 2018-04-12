// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var MongoClient = require('mongodb').MongoClient;

// TODO these need to be in config file(s)
var db_url = 'mongodb://localhost:27017';
var db_name = 'recipes4';

var collection_recipe = 'recipe';
var collection_cookbook = 'cookbook';
var collection_tag = 'recipe_tag';
var collection_recipe_tag_join = 'recipe_tag_join';
var collection_count = 0;

var database;

//var url = 'mongodb://localhost:27017/recipes4';
var url = db_url + '/' + db_name;

console.log('url = ' + url);

try {
    _connect(url, _postCreateDb);
//    _connect(url, function(db) {
//        console.log('recipe db: ' + db);
//        recipeCol = _createCollection(db, collection_recipe);
//        db.close();
//    });


//  console.log('recipe db: ' + db);
//  recipeCol = _createCollection(db, collection_recipe);
//  db.close();
} catch (err) {
  console.log('caught error: ' + err);
  db.close();
}

//try {
//  db = _connect(url);
//  console.log('cookbook db: ' + db);
//  cookbookCol = _createCollection(db, collection_cookbook);
//  db.close();
//} catch (err) {
//  console.log('caught error: ' + err);
//}
//
//try {
//  db = _connect(url);
//  console.log('tag db: ' + db);
//  tagCol = _createCollection(db, collection_tag);
//  db.close();
//} catch (err) {
//  console.log('caught error: ' + err);
//}
//
//try {
//  db = _connect(url);
//  console.log('recipe tag join db: ' + db);
//  recipeTagCol = _createCollection(db, collection_recipe_tag_join);
//  db.close();
//} catch (err) {
//  console.log('caught error: ' + err);
//}

//MongoClient.connect(url, function(err, db) {
//  // TODO log the error instead and skip the rest
////  console.log(db);
//  if (err) throw err;
//  console.log('Database created!');
//
////  _createCollection(db, collection_recipe);
//  console.log('createCollection() collectionName = ' + collection_recipe);
//
//  db.createCollection(collection_recipe, function(err, res) {
//    if (err) throw err;
//    console.log(res);
//    console.log(collection_recipe + ' collection created');
//    db.close(); // moving close() to here works from the end of the connect() statementy
//  });
////  _createCollection(db, collection_cookbook);
////  _createCollection(db, collection_tag);
////  _createCollection(db, collection_recipe_tag_join);
//
//});

function _connect(url, postCreateDb) {
  MongoClient.connect(url, postCreateDb);
//  MongoClient.connect(url, function(err, db) {
  // TODO log the error instead and skip the rest

  //  console.log(db);
//    if (err) throw err;
//    console.log('Connected to ' + url);
//    return db;
//  });
}

function _postCreateDb(err, db) {
//    console.log('_postCreateDb');
    database = db;
    if (err) throw err;
    console.log('  Connected to ' + url);
    _createCollection(db, collection_recipe, _postCreateCollection);
    _createCollection(db, collection_cookbook, _postCreateCollection);
    _createCollection(db, collection_recipe_tag_join, _postCreateCollection);
    _createCollection(db, collection_tag, _postCreateCollection);
    // TODO close the connection when the last collection is created
}

function _createCollection(database, collectionName, postCreateCollection) {
  collection_count++;
  console.log('_createCollection() collection_count = ' + collection_count + ', collectionName = ' + collectionName);

  database.createCollection(collectionName, postCreateCollection);
//  database.createCollection(collectionName, function(err, collection) {
//    if (err) throw err;
//    console.log(collection);
//    console.log(collectionName + ' collection created');
//    return collection;
//  });
}

function _postCreateCollection(err, collection) {
//    console.log('_postCreateCollection()');
    collection_count--;
    if (err) throw err;
//    console.log(collection);
//    console.log('collection.s.name: ' + collection.s.name);
//    console.log('collection.s.dbName: ' + collection.s.dbName);
    console.log('  collection_count = ' + collection_count + ', created collection: ' + collection.s.name);
//    return collection;
    if (collection_count == 0) { // this works, but it seems like a hack
        database.close();
    }
}
