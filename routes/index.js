const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../auth/isAuthenticated');
const config = require('../config');
const { formatTags } = require('../util/formatting');
const writeNoteToFile = require('../util/hugo');
const {sync, publish} = require('../util/git');
const post = require('../util/social')

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  sync();
  res.render('index', { title: 'Express' });
});

// Route to handle form submission
router.post('/', isAuthenticated, (req, res) => {
  let date = new Date()
  
  let formattedTags = formatTags(req.body.tags);

  const data = {
    title: req.body.title,
    note: req.body.note,
    date: date,
    tags: formattedTags,
    source: req.body.source
  };

  writeNoteToFile(data);
  publish(data);

  if (!config.hugo_draft_mode) {
    post(data);
  }

  res.render('success');

});

module.exports = router;