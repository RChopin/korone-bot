module.exports = {
  name: "shop",
  description: "Shop",
  execute: async (message, args, currency, Users, ItemShop, app) => {
    const items = await ItemShop.findAll();
    return message.reply(
      items.map((i) => `${i.name}: ${i.cost}:CryptoDOGE:`).join("\n"),
      { whispered: true, mentionUser: false }
    );
  },
};
