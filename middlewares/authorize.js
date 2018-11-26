module.exports = function(req, res, next) {
  if (req.loggedInUser.role == 1) {
    return next();
  } else {
    res.status(401).json({
      message: 'you are not authorized'
    });
  }
}