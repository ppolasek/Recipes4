var fs = require('fs');

var filename = 'myNewFile2.txt';

fs.unlink(filename, function(err) {
  if (err) throw err;
  console.log('Deleted file: ' + filename);
});
