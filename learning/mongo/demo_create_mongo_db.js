var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log('Database created!');
    console.log(db);
    db.close();
    // This is logged:
// Db {
//     domain: null,
//         _events: {},
//     _eventsCount: 0,
//         _maxListeners: undefined,
//         s:
//     { databaseName: 'mydb',
//         dbCache: {},
//         children: [],
//             topology:
//         Server {
//         domain: null,
//             _events: [Object],
//             _eventsCount: 7,
//             _maxListeners: undefined,
//             clientInfo: [Object],
//             s: [Object] },
//         options:
//         { readPreference: [Object],
//             promiseLibrary: [Function: Promise] },
//         logger: Logger { className: 'Db' },
//         bson: BSON {},
//         authSource: undefined,
//             readPreference:
//         ReadPreference {
//         _type: 'ReadPreference',
//             mode: 'primary',
//             tags: undefined,
//             options: undefined },
//         bufferMaxEntries: -1,
//             parentDb: null,
//         pkFactory: undefined,
//         nativeParser: undefined,
//         promiseLibrary: [Function: Promise],
//         noListener: false,
//             readConcern: undefined },
//     serverConfig: [Getter],
//         bufferMaxEntries: [Getter],
//         databaseName: [Getter] }

});
