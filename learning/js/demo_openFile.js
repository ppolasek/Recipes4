var fs = require('fs');

var filename = 'myNewFile2.txt';

fs.open(filename, 'w', function(err, file) {
  if (err) throw err;
  console.log('Saved ' + filename);
});
