const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');

const User = require('../models/user');

authRouter.post('/signup', (req, res, next) => {
  User.register(new User({ email: req.body.email }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    }
    else {
      passport.authenticate('local')(req, res, () => {
        const token = authenticate.genToken({ _id: user._id });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ sucess: true, token: token, status: 'Sucessfully Registered!' });
      });
    }
  })
});

authRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  const token = authenticate.genToken({ _id: req.user._id });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ sucess: true, token: token, status: 'Sucessfully Logged In!' });
});

// Goolge OAuth
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Redirect Route
authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  if (req.user) {
    const token = authenticate.genToken({ _id: req.user._id });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ sucess: true, token: token, status: 'Sucessfully Logged In!' });
  }
});

authRouter.get('/facebook', (req, res, next) => {
  res.send('Haven\'t Implemented Yet!');
});

module.exports = authRouter;
