const {createDatePath, formatTitle} = require('./formatting');
const config = require('../config');
const fs = require('fs');

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

function writeNoteToFile(data) {

    const NOTES_LOCATION = "git/content/notes";
    const DRAFT_MODE = config.hugo_draft_mode;
    
    const datePath = createDatePath(data.date);
    
    const folder = `${NOTES_LOCATION}/${datePath}`;
  
    fs.mkdirSync(folder, { recursive: true }, (err) => {
      if (err) throw err;
    });
  
    const output = formatOutput(data, DRAFT_MODE);
  
    const formattedTitle = formatTitle(data.title);
    
    fs.writeFileSync(`${folder}/${formattedTitle}.md`, output);
}

module.exports = writeNoteToFile;