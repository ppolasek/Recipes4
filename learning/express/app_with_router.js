var express = require('express');
var app = express();
var wiki = require('./router_demo.js');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use('/wiki', wiki);

app.listen(3000, function () {
    console.log('Example app listening on port 3000');
});
