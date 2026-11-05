const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../auth/passport');

// Trigger Google OAuth flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // Requesting access to profile and email
  }));
  
  // Callback route upon successful Google OAuth, other accounts get a 401
router.get('/google/callback', passport.authenticate('google'),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/');
  });

module.exports = router;