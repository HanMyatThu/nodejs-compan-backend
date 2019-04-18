const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/keys');

// routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const listRouter = require('./routes/lists');
const scheduleRouter = require('./routes/schedules');
const labelRouter = require('./routes/labels');

const app = express();

// middlewares
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/lists', listRouter);
app.use('/schedules', scheduleRouter);
app.use('/labels', labelRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

// connect to mongodb
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err.message);
  }
  else{
    console.log('MongoDB Successfully Connected ...');
  }
});

module.exports = app;
