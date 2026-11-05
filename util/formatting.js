function formatTitle(title) {
  let formattedTitle = title
    .toLowerCase()
    .replace(/'/g, '') //Remove '
    .replace(/[^\p{L}\p{N}]+/gu, '-') //Replace whitespace and symbols (incl. / and .) with -
    .replace(/^-+|-+$/g, ''); //Trim leading and trailing -
  return formattedTitle;
}

function applyLeadingZero(dateOrMonth) {
  if (dateOrMonth < 10) {
    dateOrMonth = `0${dateOrMonth}`;
  }
  return dateOrMonth;
}

function createDatePath(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = applyLeadingZero(month);
  let day = date.getDate();
  day = applyLeadingZero(day);
  return `${year}/${month}/${day}`;
}

function formatTags(tags) {
  return tags.split(/\s+/).filter(tag => tag !== "");
}

module.exports = {formatTitle, applyLeadingZero, createDatePath, formatTags};
