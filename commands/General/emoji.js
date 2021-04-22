module.exports = {
  name: "emoji",
  description: "Sends random emoji",
  usage: "k!emoji",
  execute: (message, args) => {
    const emojis = [":CoolHouse:", ":EZ:", ":HACKERMANS:"];
    const msgObj = [`${emojis[Math.floor(Math.random() * 3)]}`];
    message.reply(msgObj, { whispered: true, mentionUser: false });
  },
};
