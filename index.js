const { Client, EVENT } = require("dogehouse.js");
require("dotenv").config();

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Users, ItemShop } = require("./dbObjects");
const Collection = require("@discordjs/collection");
const currency = new Collection();

const app = new Client();

const token = process.env.DOGEHOUSE_TOKEN;
const refreshToken = process.env.DOGEHOUSE_REFRESH_TOKEN;

// Commands initialization

const prefix = "k!";

const fs = require("fs");

commands = new Array();

const loadCommands = () => {
  commands.length = 0;

  const commandFolders = fs.readdirSync("./commands");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      command.category = folder;
      commands.push(command);
    }
  }
};

// Tags
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
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

// Currency
Reflect.defineProperty(currency, "add", {
  /* eslint-disable-next-line func-name-matching */
  value: async function add(id, amount) {
    const user = currency.get(id);
    if (user) {
      user.balance += Number(amount);
      return user.save();
    }
    const newUser = await Users.create({ user_id: id, balance: amount });
    currency.set(id, newUser);
    return newUser;
  },
});

Reflect.defineProperty(currency, "getBalance", {
  /* eslint-disable-next-line func-name-matching */
  value: function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
  },
});

// Logic?
app
  .connect(token, refreshToken)
  .then(async () => {
    console.log("Bot connected.");
    loadCommands();
    app.rooms.join(process.env.ROOM_ID);
  })
  .then(async () => {
    console.log(`Bot joined the room :cowboy:`);
    Tags.sync();
    const storedBalances = await Users.findAll();
    storedBalances.forEach((b) => currency.set(b.user_id, b));
  });

app.on(EVENT.NEW_CHAT_MESSAGE, (message) => {
  currency.add(message.author.id, 1);

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "help") {
    commands
      .find((com) => com.name == command)
      .execute(message, args, commands);
    return;
  }

  if (
    message.content == prefix + "reload" &&
    message.author.id == process.env.OWNER_ID
  ) {
    loadCommands();
    return;
  }

  const commandCheck = commands.find((com) => com.name == command);
  if (commandCheck.category == "Economy") {
    commandCheck.execute(message, args, currency, Users, ItemShop, app, Op);
    return;
  } else if (commandCheck.category == "Tags") {
    commandCheck.execute(message, args, Tags);
    return;
  } else {
    commandCheck.execute(message, args);
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
