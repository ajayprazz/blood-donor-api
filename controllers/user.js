var express = require('express');
var router = express.Router();

var UserModel = require('./../models/users.model');

var authorize = require('./../middlewares/authorize');

var map_user_request = require('./../config/user');

module.exports = function() {
  router.route('/')
    .get(authorize, function(req, res, next) {
      UserModel.find({})
        .exec(function(err, users) {
          if (err) {
            return next(err);
          }
          res.status(200).json(users);
        })
    })

  router.route('/:id')
    .get(function(req, res, next) {
      UserModel.findById(req.params.id)
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (user) {
            res.status(200).json(user);
          } else {
            res.json({
              message: 'user not found'
            })
          }
        })
    })
    .put(function(req, res, next) {
      UserModel.findById(req.params.id)
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (user) {
            updatedUser = map_user_request(user, req.body);
            updatedUser.save(function(err, user) {
              if (err) {
                return next(err);
              }
              res.status(200).json(user);
            })
          } else {
            res.json({
              message: 'user not found'
            });
          }
        });
    })
    .delete(function(req, res, next) {
      UserModel.findById(req.params.id)
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (user) {
            user.remove(function(err, user) {
              if (err) {
                return next(err);
              }
              res.json(user);
            });
          } else {
            res.json({
              message: 'user not found'
            })
          }
        })
    });

  router.route('/search')
    .post(function(req, res, next) {
      var condition = {};
      console.log('req.body', req.body);
      var searchQuery = map_user_request(condition, req.body);
      console.log('searchQuery', searchQuery);
      UserModel.find(searchQuery)
        .exec(function(err, users) {
          if (err) {
            return next(err);
          }
          if (users.length) {
            res.status(200).json(users);
          } else {
            res.status(400).json({
              message: 'no matching bloodgroup'
            });
          }
        });
    });

  return router;
}