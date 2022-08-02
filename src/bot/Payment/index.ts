import { commands as commandsConfig } from "@config/bot";
import telegramConfig from "@config/telegram";
import TelegramBot from "node-telegram-bot-api";
interface IPayment {
  execute: (bot: TelegramBot) => Promise<any>;
}
class Payment implements IPayment {
  private callbackKey: string = "pay";
  private titleOptions: string = "Prestação de serviço";
  public execute = async (bot: TelegramBot) => {
    const callbackKey = this.callbackKey;
    // Intercepta o comando para serviço
    bot.onText(commandsConfig.payment.regex, (msg, match) => {
      const chatId = msg.chat.id;
      var products = [
        [
          {
            text: "R$ 2000,00",
            callback_data: callbackKey + ":2000.00",
            pay: true,
          },
          // {
          //   text: "R$ 2000,00",
          //   callback_data: callbackKey +":2000.00",
          //   pay: true,
          // },
        ],
        // [
        //   {
        //     text: "R$ 2000,00",
        //     callback_data: callbackKey +":2000.00",
        //     pay: true,
        //   },
        // ],
      ];

      bot.sendMessage(chatId, this.titleOptions, {
        reply_markup: {
          inline_keyboard: products,
        },
      });
    });
    // Recebe opção selecionada pelo usuário
    bot.on("callback_query", function (msg: any) {
      const userId = msg.from.id;
      const optionSelected = msg.data;
      const optionSplited = optionSelected.split(":");
      var action = optionSplited[0];

      if (action === callbackKey) {
        var price = optionSelected.split(":")[1].replace(".", "");

        var payload = `${userId}.${Date.now()}.${price}`;
        var prices = [
          {
            label: "Compra 1",
            amount: parseInt(price) / 2, // if you have a decimal price with . instead of ,
          },
          {
            label: "Compra 2",
            amount: parseInt(price) / 2, // if you have a decimal price with . instead of ,
          },
        ];
        bot.sendInvoice(
          msg.from.id,
          // Titulo do item selecionado
          "Serviço",
          // Descrição
          "Compra de frases especiais",
          // Descrição
          payload,
          // Token stripe
          telegramConfig.stripe,
          "pay",
          // Moeda
          "BRL",
          // Valores do serviço
          prices,
          // Valores do serviço
          {
            photo_url: "https://avatars.githubusercontent.com/u/30788371?v=4",
            photo_width: 500,
            photo_height: 500,
            need_email: true,
            need_name: true,
            need_phone_number: true,
            disable_notification: true,
          }
        );
      }
    });
    // * Realiza um pré-checkout da compra
    bot.on("pre_checkout_query", (query) => {
      console.log(`[bot] pre checkout`);
      console.log(query);
      bot.answerPreCheckoutQuery(query.id, true);
    });
    bot.on("successful_payment", (msg) => {
      console.log(`[bot] successful payment`);
      console.log("Successful Payment", msg);
      bot.sendMessage(msg.chat.id, "Thank you for your purchase!");
    });
    // * Verifica o status do pagamento
    bot.on("message", function (message) {
      if (message.successful_payment != undefined) {
        console.log("sucessful_paymeny", message);

        var savedPayload = message.successful_payment.invoice_payload; // get from db
        var savedStatus = "WAIT"; // get from db, this should be "WAIT"
        console.log(
          savedPayload != message.successful_payment.invoice_payload,
          savedStatus != "WAIT"
        );
        if (
          savedPayload != message.successful_payment.invoice_payload ||
          savedStatus != "WAIT"
        ) {
          // match saved data to payment data received
          bot.sendMessage(message.chat.id, "Payment verification failed");
          return;
        }

        // payment successfull
        bot.sendMessage(message.chat.id, "Payment complete!");
      }
    });
  };
}
export default new Payment();
