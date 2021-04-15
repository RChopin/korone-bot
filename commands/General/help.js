module.exports = {
  name: "help",
  description: "Help",
  execute: (message, args, commands) => {
    msgObj = new Array();
    msgObj.push("My commands are: k! +");
    for (const command of commands) {
      msgObj.push("`" + command.name + "`");
    }

    message.reply(msgObj, { whispered: true, mentionUser: true });
  },
};
