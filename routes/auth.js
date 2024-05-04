const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../auth/passport');

// Trigger Google OAuth flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // Requesting access to profile and email
  }));
  
  // Callback route upon successful Google OAuth
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), 
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/');
  });

module.exports = router;