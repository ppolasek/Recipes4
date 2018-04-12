var url = require('url');

var adr = 'http://localhost:8080/default.htm?year=2017&month=february';

var q = url.parse(adr, true);

console.log('q: ' + q); // returns [object Object]
console.log('adr: ' + adr); // returns http://localhost:8080/default.htm?year=2017&month=february
console.log('host: ' + q.host); // returns localhost:8080
console.log('pathname: ' + q.pathname); // return /default.htm
console.log('search: ' + q.search); // returns ?year=2017&month=february

var qdata = q.query;
console.log('qdata: ' + qdata); // returns [object Object]
console.log('qdata.month: ' + qdata.month); // returns february

