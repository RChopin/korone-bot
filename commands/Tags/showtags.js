module.exports = {
  name: "showtags",
  description: "Show tags",
  execute: async (message, args, Tags) => {
    const tagList = await Tags.findAll({ attributes: ["name"] });
    const tagString = tagList.map((t) => t.name).join(", ") || "No tags set.";
    return message.reply(`List of tags: ${tagString}`);
  },
};
