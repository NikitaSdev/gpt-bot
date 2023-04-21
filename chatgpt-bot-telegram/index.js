require('dotenv').config()
const {Configuration, OpenAIApi} = require("openai");
const {getImage, getChat} = require("./Helper/functions");
const {Telegraf} = require("telegraf");

const configuration = new Configuration({
    apiKey: process.env.API,
});
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);
let stateSwitch = true
bot.start((ctx) => ctx.reply("Радушно приветствую"));

bot.help((ctx) => {
    ctx.reply(
        "Джипити \n /image -> Сгенерировать картинку по описанию\n /ask -> Задать вопрос "
    );
});


// Image command
bot.command("image", async (ctx) => {
    stateSwitch = false
    ctx.telegram.sendMessage(ctx.message.chat.id, 'Выбран режим генерации картинок',);

});

// Chat command

bot.command("ask", async (ctx) => {
    stateSwitch = true
    ctx.telegram.sendMessage(ctx.message.chat.id, 'Выбран режим текстового чата',);
});
bot.on("message", async ctx => {
    if (stateSwitch) {
        const text = ctx.message.text?.toLowerCase();

        ctx.sendChatAction("typing");
        const res = await getChat(text);

        if (res) {
            ctx.telegram.sendMessage(ctx.message.chat.id, res, {
                reply_to_message_id: ctx.message.message_id,
            });
        }
    } else {
        const text = ctx.message.text?.toLowerCase();
        const res = await getImage(text);
        if (res) {
            ctx.sendChatAction("upload_photo");
            ctx.telegram.sendPhoto(ctx.message.chat.id, res, {
                reply_to_message_id: ctx.message.message_id,
            });
        }
    }

})


bot.launch();
