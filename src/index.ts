require("dotenv").config();
import telegramConfig from "@config/telegram";
import Bot from "bot";
import TelegramBot from "node-telegram-bot-api";

const bot = new Bot(new TelegramBot(telegramConfig.token, { polling: true }));
bot.execute();
