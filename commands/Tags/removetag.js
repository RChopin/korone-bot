module.exports = {
  name: "removetag",
  description: "Remove tag",
  execute: async (message, args, Tags) => {
    const tagName = args;
    const rowCount = await Tags.destroy({ where: { name: tagName } });
    if (!rowCount) return message.reply("That tag did not exist.");

    return message.reply("Tag deleted.");
  },
};
