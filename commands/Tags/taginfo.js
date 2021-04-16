module.exports = {
  name: "taginfo",
  description: "Show tag info",
  execute: async (message, args, Tags) => {
    const tagName = args;

    const tag = await Tags.findOne({ where: { name: tagName } });
    if (tag) {
      return message.reply(
        `${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`
      );
    }
    return message.reply(`Could not find tag: ${tagName}`);
  },
};
