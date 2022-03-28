import { commands as commandsConfig } from "@config/bot";
import TelegramBot from "node-telegram-bot-api";

class Help {
  public execute = async (bot: TelegramBot) => {
    bot.onText(commandsConfig.help.regex, (msg, match) => {
      const chatId = msg.chat.id;
      bot.sendMessage(
        chatId,
        `Como funciona esse projeto?\nEsse bot foi feito mais pra teste\n\nVou continuar testando a escrita aqui, mas não sei como vai ficar no telegram, mas não custa nada testarI
        `
      );
    });
  };
}
export default new Help();
