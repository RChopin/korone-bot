module.exports = {
  name: "inventory",
  description: "Inventory",
  execute: async (message, args, currency, Users, ItemShop, app) => {
    let target = message.mentions[0] || message.author;
    if (target.user) {
      target = target.user;
    }
    const user = await Users.findOne({ where: { user_id: target.id } });
    const items = await user.getItems();

    if (!items.length)
      return message.reply(`${target.displayName} has nothing!`);
    return message.reply(
      `${target.displayName} currently has ${items
        .map((t) => `${t.amount} ${t.item.name}`)
        .join(", ")}`
    );
  },
};
