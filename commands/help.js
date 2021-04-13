module.exports = {
  name: "help",
  description: "Help",
  execute(message, args) {
    msgObj = new Array();
    msgObj.push("My commands are: k! +");
    for (const command of args) {
      msgObj.push("`" + command + "`");
    }

    message.reply(msgObj, { whispered: true, mentionUser: true });
  },
};
