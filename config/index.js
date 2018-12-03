module.exports.app = {
  port: 4040,
  jwtSecretKey: 'asdfghjkl'
}

module.exports.mongodb = {
  dbUrl: {
    dev: 'mongodb://127.0.0.1:27017/blood-donor',
    test: 'mongodb://127.0.0.1:27017/blood-donor1',
    prod: 'mongodb://127.0.0.1:27017/blood-donor2',
  }
}