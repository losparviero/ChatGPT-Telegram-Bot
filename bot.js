import 'dotenv/config';
import { Bot } from 'grammy';
import { ChatGPTAPIBrowser } from 'chatgpt';
let BOT_DEVELOPER = 0 | process.env.BOT_DEVELOPER;

// Bot

const bot = new Bot(process.env.BOT_TOKEN);

// Admin

bot.use(async (ctx, next) => {
  ctx.config = {
    botDeveloper: BOT_DEVELOPER,
    isDeveloper: ctx.from?.id === BOT_DEVELOPER,
  };
  await next();
});  

// Commands

bot.command("start", (ctx) => {
  if (!ctx.config.isDeveloper) { ctx.reply("You are not authorized to use this bot."); }
  else { ctx.reply("Welcome"); } });
bot.command("help", (ctx) => ctx.reply("*@anzubo Project.*\n\nThis is a personal bot to use ChatGPT within Telegram.\n_You can host your own instance using the repository https://github.com/Grahtni/ChatGPT-Telegram-Bot._", { parse_mode: "Markdown" } ));

// Auth

const api = new ChatGPTAPIBrowser({
  email: process.env.email,
  password: process.env.password,
  isGoogleLogin: true
});

api.initSession();

// Messages

bot.on("msg", async (ctx) => {
  
  // Logic
  
  if (!ctx.config.isDeveloper) { ctx.reply("You are not authorized to use this bot.", { reply_to_message_id:ctx.msg.message_id }); }
  else {
    ctx.reply("```Generating```", { parse_mode: "Markdown" });
    const result = await api.sendMessage(ctx.msg.text);
    //console.log("Qeury:". ctx.msg.text, "\n", "Result generated!");
    await ctx.reply(result.response, { parse_mode: "Markdown" }); }

});

// Run

console.log('Bot running. Please keep this window open or use a startup manager like PM2 to setup persistent execution and store logs.');
bot.start();