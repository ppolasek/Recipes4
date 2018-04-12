
var offset = new Date().getTimezoneOffset();
var datenow = Date.now();
var nowiso = new Date().toISOString().replace(/[TZ]/g, ' ');
var nowutc = new Date().toUTCString();
var nowstr = new Date();
var somedate = datenow - offset * 60000;

console.log('datenow = ' + datenow);
console.log('offset = ' + offset);
console.log('offset/60 = ' + offset/60);
console.log('offset * 60000 = ' + offset * 60000);
console.log('somedate = ' + somedate);
console.log(new Date(somedate));
console.log(new Date(somedate).toISOString().replace(/[TZ]/g, ' '));
console.log('raw form = ' + new Date(Date.now() - offset * 60000).toISOString().replace(/[TZ]/g, ' '));
console.log('nowiso = ' + nowiso);
console.log('nowutc = ' + nowutc);
console.log('nowstr = ' + nowstr);
console.log('');
