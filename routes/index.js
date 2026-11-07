const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../auth/isAuthenticated');
const publishNote = require('../util/hugo');
const post = require('../util/social');
const populateWithAI = require('../util/ai');
const { createDatePath, formatTitle } = require('../util/formatting');
const config = require('../config');

const LOGIN_ERRORS = {
  account: "That Google account isn't allowed to post here. Sign in with the blog owner's account."
};

router.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login', { pageTitle: 'Sign in', bodyClass: 'login-page', error: LOGIN_ERRORS[req.query.error] });
});

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  res.render('index', {title:"",note:"",tags:"", source:""});
});

// Route to handle form submission
router.post('/', isAuthenticated, async (req, res) => {
  let date = new Date()
  
  let data = {
    title: req.body.title,
    note: req.body.note,
    date: date,
    tags: req.body.tags,
    source: req.body.source
  };

  if (data.source === undefined) {
    data.note = "";
  }
  if (data.note === "" || data.note === undefined) {
    res.render('index', data);
  }
  else if ( data.title === "" || data.tags === "") {
    try {
      const autoFilledData = await populateWithAI(data);
      res.render('index', { ...autoFilledData, suggested: true });
    } catch (error) {
      console.error(error);
      res.render('index', { ...data, error: `Could not generate title/tags: ${error.message}` });
    }
  } else {
    try {
      await publishNote(data);
    } catch (error) {
      console.error(error);
      return res.render('index', { ...data, error: `Could not publish note: ${error.message}` });
    }
    post(data);
    res.render('success', {
      pageTitle: 'Published',
      published: data,
      draft: config.hugo_draft_mode === "true",
      postUrl: config.hugo_host && `${config.hugo_host}/notes/${createDatePath(data.date)}/${formatTitle(data.title)}/`
    });
  }

});

module.exports = router;