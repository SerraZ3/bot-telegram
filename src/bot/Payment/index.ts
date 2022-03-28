import { commands as commandsConfig } from "@config/bot";
import TelegramBot from "node-telegram-bot-api";

class Payment {
  public execute = async (bot: TelegramBot) => {
    bot.onText(commandsConfig.payment.regex, (msg, match) => {
      const chatId = msg.chat.id;
      var iKeys = [];
      iKeys.push([
        {
          text: "R$ 2000,00",
          callback_data: "pay:2000.00",
        },
      ]);

      bot.sendMessage(chatId, "Valor a ser pago", {
        reply_markup: {
          inline_keyboard: iKeys,
        },
      });
    });
    bot.on("callback_query", function (msg: any) {
      console.log(1, msg);
      console.log(1, msg.message.reply_markup.inline_keyboard);
      const userId = msg.from.id;
      const optionSelected = msg.data;
      var StripeToken = process.env.API_STRIPE || "";
      var func = optionSelected.split(":")[0];
      var param = optionSelected.split(":")[1];
      if (func == "pay") {
        var payload = userId + Date.now() + param; // you can use your own payload
        var prices = [
          {
            label: "Compra",
            amount: parseInt(param.replace(".", "")), // if you have a decimal price with . instead of ,
          },
        ];
        bot.sendInvoice(
          msg.from.id,
          "Compra",
          // "Compra de frases " + param + "€",
          "Compra de frases especiais",
          payload,
          StripeToken,
          "pay",
          "BRL",
          prices
        ); // send invoice button to user
        // remember to save payload and user data in db, it will be useful later
        // usually i save Payload and Status = WAIT
      }
    });
    // * Realiza um pré-checkout da compra
    bot.on("pre_checkout_query", (query) => {
      console.log(`[bot] pre checkout`);
      console.log(query);
      bot.answerPreCheckoutQuery(query.id, true);
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
