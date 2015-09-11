var express = require('express');

var config = require('./config');

var app = express();

app.use('/', express.static('./public'));

app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Jerbs',
        config: JSON.stringify(config)
    });
});

var server = app.listen(8080, function() {
    var host = '127.0.0.1';
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;
