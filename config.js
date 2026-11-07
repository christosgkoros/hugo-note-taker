const dotenv = require('dotenv');
dotenv.config();

const config = {
    github_token : process.env.GITHUB_TOKEN,
    github_repo: process.env.GITHUB_REPO, //owner/repo
    git_email: process.env.GIT_EMAIL, //the committer email, defaults to the token owner
    git_name: process.env.GIT_NAME, //the committer name, defaults to the token owner
    google_user_email: process.env.GOOGLE_USER_EMAIL,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    express_session_secret: process.env.SESSION_SECRET,
    hugo_host: process.env.HUGO_HOST,
    hugo_draft_mode : process.env.DRAFT_MODE,
    mastodon_host: process.env.MASTODON_HOST,
    mastodon_token: process.env.MASTODON_TOKEN,
    openai_token: process.env.OPENAI_TOKEN,
    ai_gateway_url: process.env.AI_GATEWAY_URL, //e.g. https://<team>.dp.fabricgateway.ai/openai/v1
    ai_gateway_key: process.env.AI_GATEWAY_KEY, //sent on the fg-api-key header
    openai_model: "gpt-6-luna"
}

module.exports = config;