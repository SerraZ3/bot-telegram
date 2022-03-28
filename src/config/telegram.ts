interface ITelegramConfig {
  token: string;
  stripe: string;
}
const telegramConfig: ITelegramConfig = {
  token: process.env.API_BOT || "",
  stripe: process.env.API_STRIPE || "",
};
export default telegramConfig;
