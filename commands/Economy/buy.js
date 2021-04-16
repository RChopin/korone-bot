module.exports = {
  name: "buy",
  description: "Buy",
  execute: async (message, args, currency, Users, ItemShop, app, Op) => {
    const item = await ItemShop.findOne({
      where: { name: { [Op.like]: args } },
    });
    if (!item) return message.reply("That item doesn't exist.");
    if (item.cost > currency.getBalance(message.author.id)) {
      return message.reply(`You don't have enough currency.`, {
        mentionUser: true,
      });
    }

    const user = await Users.findOne({ where: { user_id: message.author.id } });
    currency.add(message.author.id, -item.cost);
    await user.addItem(item);

    message.reply(`You've bought a ${item.name}`, { mentionUser: true });
  },
};
