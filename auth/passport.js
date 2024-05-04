const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');

passport.use(new GoogleStrategy({
    clientID: config.google_client_id,
    clientSecret: config.google_client_secret,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here, you would ideally lookup or save the profile information to your database
    if(profile._json.email !== config.google_user_email) {
      throw new Error("invalid user");
    }
    return cb(null, profile);
  }
));

// Serialize user into the sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser((id, done) => {

  done(null, id); // Simplified for example purposes
});