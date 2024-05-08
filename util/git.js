const fs = require('fs');
const { execShellCommand } = require('./execShellCommand');
const config = require("../config");

async function init() {

  if (!fs.existsSync("git/")) {
    fs.mkdirSync("git/", { recursive: true }, (err) => {
      if (err) throw err;
    });

    await execShellCommand(`git config --global user.email "${config.git_email}" && git config --global user.name "${config.git_name}"`);

    await execShellCommand(`git clone http://${config.github_user}:${config.github_token}@github.com/${config.github_repo} git/ -4`);
  }
}

function sync() {
  execShellCommand("git -C git/ pull -v");
}

function publish(data) {
  return execShellCommand(`git -C git/ add -A && git -C git/ commit -m "${data.title}" && git -C git/ push`);
}

module.exports = {init, sync, publish}
