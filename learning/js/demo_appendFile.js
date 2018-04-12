var fs = require('fs');

var filename = 'myNewFile1.txt';

fs.appendFile(filename, 'Hello Content!', function(err) {
  if (err) throw err;
  console.log('Saved ' + filename);
});
