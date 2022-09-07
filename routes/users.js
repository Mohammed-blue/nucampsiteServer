const express = require('express');
const User = require('../models/user');
// const { route } = require('./campsiteRouter');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Authenticate using passport:
router.post('/signup', (req, res) => {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    err=> {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        // means the registration was successful
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    }
  )
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


router.get('/logout', (req, res, next) => {
  //chx if a session exists
  if (req.session) {
    //if it does exist
    // destroy = we are deleting the session file on the server.
    req.session.destroy();
    //this will clear the cookies stored on the clint side.
    res.clearCookie('session-id');
    //this will redirect user to root path, in this case it is localhost 3000.
    res.redirect('/');
  } else {
    // if session does not exist
    // meaning clint is requesting to logout without being logged in.
    const err = new Error('You rae not logged in!');
    err.status = 401;
    return next(err);
  }
})

module.exports = router;
