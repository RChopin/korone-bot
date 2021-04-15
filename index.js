const { Client, EVENT } = require("dogehouse.js");
require("dotenv").config();
const Sequelize = require("sequelize");

// Commands initialization

const prefix = "k!";

const fs = require("fs");

commands = new Array();
commandsNames = new Array();

const loadCommands = () => {
  commands.length = 0;
  commandsNames.length = 0;
  const commandFolders = fs.readdirSync("./commands");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      commands.push(command);
      // commandsNames.push(command.name);
    }
  }
};

loadCommands();

// if (commandsNames.length != commands.length) {
//   console.log("BRUH: error");
//   loadCommands();
// }

const app = new Client();

const token = process.env.DOGEHOUSE_TOKEN;
const refreshToken = process.env.DOGEHOUSE_REFRESH_TOKEN;

// Tags
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

const Tags = sequelize.define("tags", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  username: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

// Logic

app
  .connect(token, refreshToken)
  .then(async () => {
    console.log("Bot connected.");
    app.rooms.join(process.env.ROOM_ID);
  })
  .then(() => {
    console.log(`Bot joined the room :cowboy:`);
    Tags.sync();
  });

app.on(EVENT.NEW_CHAT_MESSAGE, (message) => {
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "help") {
    commands
      .find((com) => com.name == command)
      .execute(message, args, commands);
    return;
  }

  const commandCheck = commands.find((com) => com.name == command);
  if (commandCheck) {
    commandCheck.execute(message, args, Tags);
    return;
  }

  if (
    message.content == prefix + "reload" &&
    message.author.id == process.env.OWNER_ID
  ) {
    loadCommands();
    return;
  }
});

app.on(EVENT.USER_JOINED_ROOM, (user) => {
  const privateWelcomeMessage = [
    "Hi ",
    { mention: user.username },
    "! I'm Korone, to see my commands type `k!help`",
  ];

  user.whisper(privateWelcomeMessage);
});
