const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../auth/isAuthenticated');
const publishNote = require('../util/hugo');
const post = require('../util/social');
const populateWithAI = require('../util/ai');

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
      res.render('index', autoFilledData);
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
    res.render('success');
  }

});

module.exports = router;