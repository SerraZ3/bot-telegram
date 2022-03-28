import { commands as commandsConfig } from "@config/bot";
import TelegramBot from "node-telegram-bot-api";

class Phrase {
  public execute = async (bot: TelegramBot) => {
    bot.onText(commandsConfig.phrase.regex, (msg, match) => {
      const chatId = msg.chat.id;

      bot.sendMessage(chatId, "Uma frase aleatória");
    });
  };
}
export default new Phrase();
