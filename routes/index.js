const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../auth/isAuthenticated');
const config = require('../config');
const { formatTags } = require('../util/formatting');
const writeNoteToFile = require('../util/hugo');
const {sync, publish} = require('../util/git');
const post = require('../util/social');
const populateWithAI = require('../util/ai');

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  sync();
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
    const autoFilledData = await populateWithAI(data);
    res.render('index', autoFilledData);
  } else {
    data.tags = formatTags(req.body.tags);
    writeNoteToFile(data);
    publish(data);
    post(data);
    res.render('success');
  }

});

module.exports = router;