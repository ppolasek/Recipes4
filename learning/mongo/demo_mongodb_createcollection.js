var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log(db);
  // Output:
//{ domain: null,
//  _events: {},
//  _maxListeners: undefined,
//  s:
//   { databaseName: 'mydb',
//     dbCache: {},
//     children: [],
//     topology:
//      { domain: null,
//        _events: [Object],
//        _maxListeners: undefined,
//        clientInfo: [Object],
//        s: [Object] },
//     options:
//      { readPreference: [Object],
//        promiseLibrary: [Function: Promise] },
//     logger: { className: 'Db' },
//     bson: {},
//     authSource: undefined,
//     readPreference:
//      { _type: 'ReadPreference',
//        mode: 'primary',
//        tags: undefined,
//        options: undefined },
//     bufferMaxEntries: -1,
//     parentDb: null,
//     pkFactory: undefined,
//     nativeParser: undefined,
//     promiseLibrary: [Function: Promise],
//     noListener: false,
//     readConcern: undefined },
//  serverConfig: [Getter],
//  bufferMaxEntries: [Getter],
//  databaseName: [Getter] }

  db.createCollection('customers', function(err, res) {
    if (err) throw err;
    console.log(res);
    // Output:
//    { s:
//       { pkFactory:
//          { [Function: ObjectID]
//            index: 2364472,
//            createPk: [Function: createPk],
//            createFromTime: [Function: createFromTime],
//            createFromHexString: [Function: createFromHexString],
//            isValid: [Function: isValid],
//            ObjectID: [Circular],
//            ObjectId: [Circular] },
//         db:
//          { domain: null,
//            _events: {},
//            _maxListeners: undefined,
//            s: [Object],
//            serverConfig: [Getter],
//            bufferMaxEntries: [Getter],
//            databaseName: [Getter] },
//         topology:
//          { domain: null,
//            _events: [Object],
//            _maxListeners: undefined,
//            clientInfo: [Object],
//            s: [Object] },
//         dbName: 'mydb',
//         options: { promiseLibrary: [Function: Promise] },
//         namespace: 'mydb.customers',
//         readPreference:
//          { _type: 'ReadPreference',
//            mode: 'primary',
//            tags: undefined,
//            options: undefined },
//         slaveOk: true,
//         serializeFunctions: undefined,
//         raw: undefined,
//         promoteLongs: undefined,
//         promoteValues: undefined,
//         promoteBuffers: undefined,
//         internalHint: null,
//         collectionHint: null,
//         name: 'customers',
//         promiseLibrary: [Function: Promise],
//         readConcern: undefined } }

    console.log('Collection created!');
    db.close();
  });
});
