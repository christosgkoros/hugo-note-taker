const {createDatePath, formatTitle, formatTags} = require('./formatting');
const config = require('../config');
const { commitFile } = require('./github');

// JSON strings and string arrays are valid TOML values and escape quotes, backslashes and newlines
function formatOutput(data, isDraft) {
    return `+++
  title = ${JSON.stringify(data.title)}
  date = ${JSON.stringify(data.date.toISOString())}
  tags = ${JSON.stringify(formatTags(data.tags))}
  draft = ${isDraft}
+++
${data.note}

${data.source}
`;
}

async function publishNote(data) {

    const NOTES_LOCATION = "content/notes";
    const DRAFT_MODE = config.hugo_draft_mode === "true";

    const datePath = createDatePath(data.date);

    const output = formatOutput(data, DRAFT_MODE);

    const formattedTitle = formatTitle(data.title);

    return commitFile(`${NOTES_LOCATION}/${datePath}/${formattedTitle}.md`, output, data.title);
}

module.exports = publishNote;
