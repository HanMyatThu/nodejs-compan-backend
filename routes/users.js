const express = require('express');
const userRouter = express.Router();

const User = require('../models/user');

userRouter.route('/:userId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
  })
  .get((req, res, next) => {
    User.findById(req.params.userId)
        .then(user => {
          res.send(user);
        }, err => next(err))
        .catch(err => next(err));
  })
  .post((req, res, next) => {
    res.status(405).json({ err: 'POST Method Not Allowed!' });
  })
  .put((req, res, next) => {
    User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
        .then(user => {
          if (user) {
            res.json({ success: true, updated: user, status: 'User Info Successfully Updated!' });
          }
          else {
            res.status(404).json({ err: 'User not found!' });
          }
        }, err => next(err))
        .catch(err => next(err));
  })
  .delete((req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
        .then(user => {
          if (user) {
            res.json({ success: true, updated: user, status: 'User Successfully Deleted!' });
          }
          else {
            res.status(404).json({ err: 'User not found!' });
          }
        }, err => next(err))
        .catch(err => next(err));
  });

module.exports = userRouter;
