const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../auth/passport');

// Trigger Google OAuth flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // Requesting access to profile and email
  }));
  
  // Callback route upon successful Google OAuth, other accounts go back to the sign-in page
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login?error=account' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/');
  });

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

module.exports = router;