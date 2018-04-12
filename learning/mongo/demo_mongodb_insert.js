var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { name: 'Company Inc', address: 'Highway 36' };
  var myobj2 = { 'name': 'Company Inc', 'address': 'Highway 36' };
  db.collection('customers').insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log('1 document inserted');
  });
  db.collection('customers').insertOne(myobj2, function(err, res) {
    if (err) throw err;
    console.log('1 document inserted');
    db.close();
  });
});
