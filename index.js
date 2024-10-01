const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "7144534276:AAH_fzChYOzIhdjruGA8jKjr1Wri9TV2Tks";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты должен угадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадай", gameOptions);
};

// bot.setMyCommands([
//   { command: "/start", description: "Начальное приветсвие" },
//   { command: "/info", description: "Получить информацию о пользователе" },
// ]);

// bot.on("message", async (msg) => {
//   const text = msg.text; //для ПОЛУЧНИЯ текста
//   const chatId = msg.chat.id; //для ПОЛУЧНИЯ id

//   if (text === "/start") {
//     await bot.sendSticker(
//       chatId,
//       "https://sl.combot.org/xakepstix/webp/1xf09f9881.webp"
//     );
//     await bot.sendMessage(
//       chatId,
//       `Добро пожаловать в телеграм бота автора T0basco`
//     );
//   }
//   if (text === "/info") {
//     await bot.sendMessage(
//       chatId,
//       `Тебя зовут ${msg.from.first_name} ${msg.from.username}`
//     );
//   }
// });

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветсвие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text; //для ПОЛУЧНИЯ текста
    const chatId = msg.chat.id; //для ПОЛУЧНИЯ id

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://sl.combot.org/xakepstix/webp/1xf09f9881.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бота автора T0basco`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.username}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понял, попробуй еще раз!");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
    // bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
    // console.log(msg);
  });
};

start();
