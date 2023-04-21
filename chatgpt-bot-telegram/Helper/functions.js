const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);

const getImage = async (text) => {
  try {
    const response = await openai.createImage({
      prompt: text,
      n: 1,
      size: "512x512",
    });

    return response.data.data[0].url;
  } catch (error) {
    console.log(error);
  }
};

const getChat = async (text) => {
  try {
    const messages = [{ role: "system", content: text}];
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { openai, getImage,getChat };
