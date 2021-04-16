module.exports = {
  name: "transfer",
  description: "Transfer",
  execute: (message, args, currency, Users, ItemShop, app) => {
    const currentAmount = currency.getBalance(message.author.id);
    const transferAmount = args.find((arg) => !/<@!?\d+>/.test(arg));
    const transferTarget = message.mentions[0].user;

    if (!transferAmount || isNaN(transferAmount))
      return message.reply(
        `Sorry ${message.author.displayName}, that's an invalid amount`
      );
    if (transferAmount > currentAmount)
      return message.reply(
        `Sorry ${message.author.displayName} you don't have that much.`
      );
    if (transferAmount <= 0)
      return message.reply(
        `Please enter an amount greater than zero, ${message.author.displayName}`
      );

    currency.add(message.author.id, -transferAmount);
    currency.add(transferTarget.id, transferAmount);

    return message.reply(
      `Successfully transferred ${transferAmount}💰 to ${
        transferTarget.displayName
      }. Your current balance is ${currency.getBalance(message.author.id)}💰`,
      { mentionUser: false }
    );
  },
};
