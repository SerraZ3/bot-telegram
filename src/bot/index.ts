import { CommandsType, commands as commandsConfig } from "@config/bot";
import TelegramBot from "node-telegram-bot-api";
import Help from "./Help";
import Information from "./Information";
import Payment from "./Payment";
import Phrase from "./Phrase";

export default class Bot {
  constructor(private bot: TelegramBot) {}

  public execute = async () => {
    this.errorConfig();
    await this.startConfig();
    // Pega todas as mensagens
    this.bot.on("message", (message, metadata) => {
      console.log(message, metadata);
    });

    Information.execute(this.bot);
    Help.execute(this.bot);
    Phrase.execute(this.bot);
    Payment.execute(this.bot);
  };
  private startConfig = async () => {
    try {
      const changeCommands = await this.bot.setMyCommands(
        Object.keys(commandsConfig).map((command) => ({
          command: commandsConfig[command as CommandsType].command,
          description: commandsConfig[command as CommandsType].description,
        }))
      );
      console.log(changeCommands);
      // const updates = await this.bot.getUpdates();
      // console.log(updates);
    } catch (error) {
      console.log(error);
    }
  };
  private errorConfig = () => {
    // set error callbacks
    this.bot.on("error", (msg) => console.log(`[bot] error:`, msg));
    this.bot.on("polling_error", (msg) =>
      console.log(`[bot] polling_error:`, msg)
    );
    this.bot.on("webhook_error", (msg) =>
      console.log(`[bot] webhook_error:`, msg)
    );
  };
}
