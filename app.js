var express = require('express');
mongoose = require('mongoose');
bodyParser = require('body-parser');

var db;

if (process.env.ENV == 'Test')
    db = mongoose.connect('mongodb://localhost/movieAPI_test');
else {
    db = mongoose.connect('mongodb://localhost/movieAPI');
}

var Movie = require('./models/movieModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});

movieRouter = require('./Routes/movieRoutes')(Movie);


app.use('/api/movies', movieRouter);


app.get('/', function (req, res) {
    res.send('Welcome to my API!')
});

app.listen(port, function () {
    console.log('Gulp is running my app on PORT:' + port);
});

module.exports = app;