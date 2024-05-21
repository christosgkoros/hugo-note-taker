const { OpenAI }  = require("openai");
const config = require('../config')

async function populateWithAI(data) {
  
  const openai = new OpenAI({
    apiKey: config.openai_token,
  });

  if (data.title === "") {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `For the following note, write a proper title for a blog that deals with apis, software and working in tech. Keep it as simple as possible with no more than 4 words, do not use verbs and respond only with the title without double or single quotes. The tile should contribute to SEO\\n ${data.note}`}],
      model: config.openai_model
    });
    data.title = chatCompletion.choices[0].message.content;
    console.log(data.title);
  }

  if (data.tags === "") {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `For the following note, write a list of tags for a blog, for example apis, leadership, ai. Keep it simple as possible with no more than 4 tags and respond only with the tags separated by whitespace\\n ${data.note}`}],
      model: config.openai_model
    });
    data.tags = chatCompletion.choices[0].message.content;
    console.log(data.tags);
  }

  return data;
}
module.exports  = populateWithAI;
