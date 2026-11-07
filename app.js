const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const session = require('express-session');

const passport = require('passport');
require('./auth/passport');
const config = require('./config');

const app = express();
app.set('trust proxy', 1); //Cloud Run terminates TLS in front of the app

//auth
app.use(session({
  secret: config.express_session_secret, // Choose a strong secret for session encryption
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.mastodon = Boolean(config.mastodon_host);
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.status = err.status || 500;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;