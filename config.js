const dotenv = require('dotenv');
dotenv.config();

const config = {
    github_token : process.env.GITHUB_TOKEN,
    github_user: process.env.GITHUB_USER,
    github_repo: process.env.GITHUB_REPO,
    git_email: process.env.GIT_EMAIL, //the email used in git commit messages
    git_name: process.env.GIT_NAME, //the name used in git commit messages
    google_user_email: process.env.GOOGLE_USER_EMAIL,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    express_session_secret: process.env.SESSION_SECRET,
    hugo_draft_mode : process.env.DRAFT_MODE
}

module.exports = config;