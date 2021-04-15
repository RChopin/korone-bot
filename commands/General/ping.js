module.exports = {
  name: "ping",
  description: "Ping!",
  execute: (message, args) => {
    const msgObj = [
      `ping: ${Date.now() - Date.parse(message._rawData.sentAt)}ms`,
    ];
    message.reply(msgObj, { whispered: true, mentionUser: false });
  },
};
