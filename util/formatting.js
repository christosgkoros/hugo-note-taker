function formatTitle(title) {
  title.replace(/\s+/g, '-'); //Replace whitespaces with -
  title.replace(/'/g, ''); //Remove '
  return title;
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

module.exports = {formatTitle, applyLeadingZero, createDatePath, formatTags};
