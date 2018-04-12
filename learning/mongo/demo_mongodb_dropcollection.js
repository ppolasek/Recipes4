var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;

  db.dropCollection('customers', function(err, delOk) {
    if (err) throw err;
    if (delOk) console.log('Collection deleted');
    db.close();
  });
});
