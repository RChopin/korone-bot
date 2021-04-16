module.exports = {
  name: "balance",
  description: "Balance",
  execute: (message, args, currency, Users, ItemShop, app) => {
    let target = message.mentions[0] || message.author;
    if (target.user) {
      target = target.user;
    }
    return message.reply(
      `${target.displayName} has ${currency.getBalance(target.id)}:CryptoDOGE:`,
      { mentionUser: false }
    );
  },
};
