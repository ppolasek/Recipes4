var fs = require('fs');

var filename = 'myNewFile1.txt';

fs.appendFile(filename, ' This is my text.', function(err) {
  if (err) throw err;
  console.log('Saved ' + filename);
});
