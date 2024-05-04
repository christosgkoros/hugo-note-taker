const fs = require('fs');
const { execShellCommand } = require('./execShellCommand');
const config = require("../config");

async function initGitRepo() {

  if (!fs.existsSync("git/")) {
    fs.mkdirSync("git/", { recursive: true }, (err) => {
      if (err) throw err;
    });

    await execShellCommand(`git config --global user.email "${config.git_email}" && git config --global user.name "${config.git_name}"`);

    await execShellCommand(`git clone https://${config.github_user}:${config.github_token}@github.com/${config.github_repo} git/`);
  }
}

exports.initGitRepo = initGitRepo;
