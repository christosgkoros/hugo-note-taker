const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');

passport.use(new GoogleStrategy({
    clientID: config.google_client_id,
    clientSecret: config.google_client_secret,
    callbackURL: "/auth/google/callback",
    proxy: true //build the callback URL from X-Forwarded-Proto so it stays https behind Cloud Run
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here, you would ideally lookup or save the profile information to your database
    if(profile._json.email !== config.google_user_email) {
      return cb(null, false);
    }
    return cb(null, profile);
  }
));

// Keep just what the UI shows in the session
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    email: user._json.email,
    photo: user._json.picture
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});