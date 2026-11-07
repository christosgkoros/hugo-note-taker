const { OpenAI }  = require("openai");
const config = require('../config')

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    tags: { type: "array", items: { type: "string" } }
  },
  required: ["title", "tags"],
  additionalProperties: false
};

async function populateWithAI(data) {

  // Route through the AI gateway when configured; it holds the OpenAI key, so no bearer token is sent
  const openai = config.ai_gateway_url ? new OpenAI({
    baseURL: config.ai_gateway_url,
    apiKey: config.ai_gateway_key, //required by the SDK, removed below
    defaultHeaders: { "fg-api-key": config.ai_gateway_key, "Authorization": null }
  }) : new OpenAI({
    apiKey: config.openai_token,
  });

  // One call returns both; only the fields the user left empty are used
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `For the following note for a blog that deals with apis, software and working in tech:
- title: write a proper title. Keep it as simple as possible with no more than 4 words, do not use verbs and do not wrap it in quotes. The title should contribute to SEO
- tags: write a list of tags, for example apis, leadership, ai. Keep it as simple as possible with no more than 4 tags, each a single lowercase word

${data.note}`}],
    model: config.openai_model,
    reasoning_effort: "none", //short titles and tags don't need reasoning
    response_format: { type: "json_schema", json_schema: { name: "note_metadata", strict: true, schema: SCHEMA } }
  });
  const result = JSON.parse(chatCompletion.choices[0].message.content);
  console.log(result);

  if (data.title === "") {
    data.title = result.title;
  }
  if (data.tags === "") {
    data.tags = result.tags.join(" ");
  }

  return data;
}
module.exports  = populateWithAI;
