interface ITelegramConfig {
  token: string;
}
const telegramConfig: ITelegramConfig = {
  token: process.env.API_BOT || "",
};
export default telegramConfig;
