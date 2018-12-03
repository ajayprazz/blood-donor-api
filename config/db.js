var mongoose = require('mongoose');
var config = require('./index');

var dbUrl = config.mongodb.dbUrl[process.env.ENV || 'dev']

mongoose.connect(dbUrl, {
  useNewUrlParser: true
});

mongoose.connection.once('open', function(done) {
  console.log('database connection successfull', dbUrl);
})

mongoose.connection.on('error', function(error) {
  console.log('database connection error');
})

mongoose.set('useCreateIndex', true);