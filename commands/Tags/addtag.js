module.exports = {
  name: "addtag",
  description: "Add tag",
  execute: async (message, args, Tags) => {
    const tagName = args.shift();
    const tagDescription = args.join(" ");

    try {
      // equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
      const tag = await Tags.create({
        name: tagName,
        description: tagDescription,
        username: message.author.username,
      });
      return message.reply(`Tag ${tag.name} added.`);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return message.reply("That tag already exists.");
      }
      return message.reply("Something went wrong with adding a tag.");
    }
  },
};
