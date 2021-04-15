module.exports = {
  name: "edittag",
  description: "Edit tag",
  execute: async (message, args, Tags) => {
    const tagName = args.shift();
    const tagDescription = args.join(" ");

    // equivalent to: UPDATE tags (descrption) values (?) WHERE name = ?;
    const affectedRows = await Tags.update(
      { description: tagDescription },
      { where: { name: tagName } }
    );
    if (affectedRows > 0) {
      return message.reply(`Tag ${tagName} was edited.`);
    }
    return message.reply(`Could not find a tag with name ${tagName}.`);
  },
};
