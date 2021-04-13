const { Client, EVENT } = require("dogehouse.js");
require("dotenv").config();

// Commands initialization

const prefix = "k!";

const fs = require("fs");

commands = new Array();
commandsNames = new Array();

const loadCommands = () => {
  commands.length = 0;
  commandsNames.length = 0;
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
    commandsNames.push(command.name);
  }
};

loadCommands();

if (commandsNames.length != commands.length) {
  console.log("BRUH: error");
  loadCommands();
}

const app = new Client();

const token = process.env.DOGEHOUSE_TOKEN;
const refreshToken = process.env.DOGEHOUSE_REFRESH_TOKEN;

// Logic

app
  .connect(token, refreshToken)
  .then(async () => {
    console.log("Bot connected.");
    app.rooms.join(process.env.ROOM_ID);
  })
  .then(() => {
    console.log(`Bot joined the room :cowboy:`);
  });

app.on(EVENT.NEW_CHAT_MESSAGE, (message) => {
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "help") {
    let comIndex = commandsNames.indexOf(command);
    commands[comIndex].execute(message, commandsNames);
    return;
  }

  if (commandsNames.includes(command)) {
    let comIndex = commandsNames.indexOf(command);
    commands[comIndex].execute(message, args);
    return;
  }

  if (
    message.content == prefix + "reload" &&
    message.author.id == process.env.OWNER_ID
  ) {
    loadCommands();
  }
});

app.on(EVENT.USER_JOINED_ROOM, (user) => {
  const publicWelcomeMessage = [
    { mention: user.username },
    " has joined the room!",
  ];
  const privateWelcomeMessage = [
    "Hi ",
    { mention: user.username },
    "! I'm Korone, to see my commands type `k!help`",
  ];

  // app.bot.sendMessage(publicWelcomeMessage);

  user.whisper(privateWelcomeMessage);
});
