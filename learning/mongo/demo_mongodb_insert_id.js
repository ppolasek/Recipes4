var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;

  var myobj = [
    { _id: 15, 'name': 'Chocolate Heaven'},
    { _id: 16, 'name': 'Tasty Lemon'},
    { _id: 17, 'name': 'Vanilla Dream'}
  ];

  db.collection('products').insertMany(myobj, function(err, res) {
    if (err) throw err;
//    console.log('res: ' + res);
//    console.log('res.result: ' + res.result);
//    console.log('res.ops: ' + res.ops);
//    console.log('res.insertedIds: ' + res.insertedIds);
    console.log(res);
    // output is:
    //    { result: { ok: 1, n: 3 },
    //      ops:
    //       [ { _id: 15, name: 'Chocolate Heaven' },
    //         { _id: 16, name: 'Tasty Lemon' },
    //         { _id: 17, name: 'Vanilla Dream' } ],
    //      insertedCount: 3,
    //      insertedIds: [ 15, 16, 17 ] }

    db.close();
  });
});
