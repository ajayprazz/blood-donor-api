var jwt = require('jsonwebtoken');
var config = require('./../config');
var UserModel = require('./../models/users.model');

module.exports = function(req, res, next) {
  var token;
  if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  }
  if (req.headers['authorization']) {
    token = req.headers['authorization'];
  }
  if (req.headers.token) {
    token = req.headers.token;
  }
  if (req.query.token) {
    token = req.query.token;
  }

  if (token) {
    jwt.verify(token, config.app.jwtSecretKey, function(err, decoded) {
      if (err) {
        return next(err);
      }
      if (decoded) {
        UserModel.findById(decoded.id)
          .exec(function(err, user) {
            if (err) {
              return next(err);
            }
            if (user) {
              req.loggedInUser = user; //to use in authorize middleware
              return next();
            } else {
              res.status(204).json({
                message: 'user not found'
              })
            }
          })
      } else {
        res.status(400).json({
          message: 'token verification failed'
        });
      }
    })
  } else {
    res.status(400).json({
      message: 'token not provided'
    });
  }

}