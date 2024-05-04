const express = require('express');
const router = express.Router();
const jade = require('jade');
const fs = require('fs');
const { execShellCommand } = require('../util/execShellCommand');
const { isAuthenticated } = require('../auth/isAuthenticated');
const config = require('../config');

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  syncRepo();
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

  res.render('success');

});

function syncRepo() {
  execShellCommand("git -C git/ pull -v");
}

function publish(data) {
  return execShellCommand(`git -C git/ add -A && git -C git/ commit -m ${data.title} && git -C git/ push`);
}

function formatTags(tags) {
  let tagsArray = tags.split(' ');
  let formattedTags = "";
  for (let i = 0; i < tagsArray.length; i++) {
    if (i !== tagsArray.length - 1) {
      formattedTags += `"${tagsArray[i]}",`;
    } else {
      formattedTags += `"${tagsArray[i]}"`;
    }
  }
  return formattedTags;
}

function writeNoteToFile(data) {

  const NOTES_LOCATION = "git/content/notes";
  const DRAFT_MODE = config.hugo_draft_mode;
  
  let year = data.date.getFullYear();
  let month = data.date.getMonth()+1;
  month = applyLeadingZero(month);
  let date = data.date.getDate();
  date = applyLeadingZero(date);
  
  const folder = `${NOTES_LOCATION}/${year}/${month}/${date}`;

  fs.mkdirSync(folder, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const output = formatOutput(data, DRAFT_MODE);

  fs.writeFileSync(`${folder}/${data.title}.md`, output);
}

function applyLeadingZero(dateOrMonth) {
  if (dateOrMonth < 10) {
    dateOrMonth = `0${dateOrMonth}`;
  }
  return dateOrMonth;
}

function formatOutput(data, isDraft) {
  return `+++ 
title = "${data.title}"
date = "${data.date.toISOString()}"
tags = [ ${data.tags} ]
draft = "${isDraft}"
+++
${data.note}

${data.source}
`;
}

module.exports = router;