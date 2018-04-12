var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = '.' + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("File not found: " + filename);
    } else {
      res.writeHead(200, {'content-type': 'text/html'});
      res.write(data);
      return res.end();
    }
  });

}).listen(8191);
