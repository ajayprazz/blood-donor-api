var express = require('express');
var router = express.Router();

var config = require('./../config');
var jwt = require('jsonwebtoken');

const UserModel = require('./../models/users.model');

var bcrypt = require('bcrypt');
const saltRounds = 10;

var nanoid = require('nanoid');

var map_user_request = require('./../config/user');

var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'broadwaytest44@gmail.com',
    pass: 'Broadwaytest44!'
  }
});

function createMailOptions(data) {
  const mailOptions = {
    from: '"Blood Donor App" <noreply@gmail.com>', // sender address
    to: 'ajayprazz@gmail.com,' + data.email, // list of receivers
    subject: 'Password Reset', // Subject line
    text: 'Hello world?', // plain text body
    html: `<p> Hi <strong> ${data.name} </strong> we noticed that you are having a trouble logging into our system. please click the link below for resetting your password.</p >
    <p><a href = "${data.link}" target = "_blank" rel="noopener noreferrer"> click here </a></p>
      <p> If you have not requested for resetting password please ignore this email. </p>
      <p> Regards,</p>
      <p> Blood Donor App </p>` // html body
  };
  return mailOptions;
}


module.exports = function() {
  router.route('/register')
    .post(function(req, res, next) {
      newUser = new UserModel({});
      mappedNewUser = map_user_request(newUser, req.body);
      mappedNewUser.save(function(err, user) {
        if (err) {
          return next(err);
        }
        res.status(200).json(user);
      })
    })

  router.route('/login')
    .post(function(req, res, next) {
      UserModel.findOne({
          username: req.body.username
        })
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (user) {
            const matched = bcrypt.compareSync(req.body.password, user.password);
            if (matched) {
              const token = jwt.sign({
                id: user._id,
                username: user.username
              }, config.app.jwtSecretKey);
              res.status(200).json({
                token: token,
                user: user
              });
            } else {
              res.status(400).json({
                message: 'invalid username or password'
              });
            }
          } else {
            res.status(400).json({
              message: 'invalid username or password'
            });
          }
        })
    })

  router.route('/forgotPassword')
    .post(function(req, res, next) {
      UserModel.findOne({
        email: req.body.email
      }).exec(function(err, user) {
        if (err) {
          return next(err);
        }
        if (user) {
          const forgotPasswordToken = nanoid();
          user.forgotPasswordToken = forgotPasswordToken;
          user.forgotPasswordTokenExpiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
          user.save(function(err, done) {
            if (err) {
              return next(err);
            }
            const redirectUrl = `${req.headers.origin}/auth/reset-password/${forgotPasswordToken}`;
            var mailOpt = createMailOptions({
              name: user.username,
              email: user.email,
              link: redirectUrl
            })
            transporter.sendMail(mailOpt, function(error, info) {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              res.status(200).json({
                message: 'Password reset link sent, please check your email'
              });
            });
          })
        } else {
          res.status(404).json({
            message: 'user not found from requested email'
          })
        }
      })
    });

  router.route('/resetPassword/:token')
    .post(function(req, res, next) {
      UserModel.findOne({
        forgotPasswordToken: req.params.token
      }).exec(function(err, user) {
        if (err) {
          return next(err);
        }
        if (user) {
          if (new Date(user.forgotPasswordTokenExpiryDate).getTime() > Date.now()) {
            user.password = bcrypt.hashSync(req.body.password, saltRounds);
            user.forgotPasswordToken = null;
            user.forgotPasswordTokenExpiryDate = null;
            user.save(function(error, done) {
              if (err) {
                return next(err);
              }
              res.status(200).json({
                message: 'password changed successfully'
              });
            })
          } else {
            res.status(400).json({
              message: 'token expired'
            })
          }
        } else {
          res.status(404).json({
            message: 'user not found'
          });
        }
      });
    });


  return router;
}