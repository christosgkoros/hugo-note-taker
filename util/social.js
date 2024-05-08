const config = require ('../config')
const { createDatePath, formatTitle } = require('./formatting')
const Headers = require('node-fetch').Headers;

function post(data){
    postToMastodon(data);
  }
  
function postToMastodon(data){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${config.mastodon_token}`);
  
    const datePath = createDatePath(data.date);
    const formattedTitle = formatTitle(data.title);
    
    const note = data.note.length>450? `${data.note.substring(0,447)}...`: data.note;
  
    const status = `${note}
  
  ${config.hugo_host}/notes/${datePath}/${formattedTitle}`;
  
    const urlencoded = new URLSearchParams();
    urlencoded.append("status", status );
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };
  
    fetch(`${config.mastodon_host}/api/v1/statuses`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error))
  }
  
module.exports = post;