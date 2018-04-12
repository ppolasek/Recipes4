var fs = require('fs');

var filename = 'myNewFile3.txt';

fs.writeFile(filename, 'Hello Content!', function(err) {
  if (err) throw err;
  console.log('Saved ' + filename);
});
