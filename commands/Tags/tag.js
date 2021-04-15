module.exports = {
  name: "tag",
  description: "Use tag",
  execute: async (message, args, Tags) => {
    const tagName = args;

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });
    if (tag) {
      // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
      tag.increment("usage_count");
      return message.reply(tag.get("description"), { mentionUser: false });
    }
    return message.reply(`Could not find tag: ${tagName}`);
  },
};
