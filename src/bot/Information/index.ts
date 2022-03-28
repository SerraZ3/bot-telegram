import { commands as commandsConfig } from "@config/bot";
import TelegramBot from "node-telegram-bot-api";

class Information {
  public execute = async (bot: TelegramBot) => {
    bot.onText(commandsConfig.info.regex, (msg, match) => {
      const chatId = msg.chat.id;
      bot.sendMessage(
        chatId,
        "Esse Bot foi desenvolvido com finalidade de teste"
      );
    });
  };
}
export default new Information();
