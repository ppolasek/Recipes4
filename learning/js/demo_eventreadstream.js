var fs = require('fs');

var filename = 'demofile.txt';
var readStream = fs.createReadStream(filename);

/* Write to the console when the file is opened: */
readStream.on('open', function () {
  console.log(filename + ' file is open');
});
