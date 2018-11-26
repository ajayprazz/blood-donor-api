var express = require('express');
//creating an express server
var app = express();


var config = require('./config');
require('./config/db.js');


//import middlewares
var authenticate = require('./middlewares/authenticate');
var authorize = require('./middlewares/authorize');

var cors = require('cors');
app.use(cors());

//import routes
var authRoute = require('./controllers/auth')();
var userRoute = require('./controllers/user')();

var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
//parse application/json
app.use(bodyParser.json());



app.use('/auth', authRoute);
app.use('/user', authenticate, userRoute);


//error handling middleware
app.use(function(err, req, res, next) {
  res.status(err.status || 400).json(err);
})


app.listen(config.app.port, function(err, done) {
  if (err) {
    console.log('server listening failed');
  } else {
    console.log('server listening at port ', config.app.port);
  }
})