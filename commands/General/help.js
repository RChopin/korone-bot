module.exports = {
  name: "help",
  description: "Help",
  execute: (message, args, commands) => {
    let msgObj;
    let command = commands.find((com) => com.name == args[0]);
    if (args.length > 0) {
      msgObj = `${command.name} \`description\`: ${command.description} \`usage\`: ${command.usage}`;
    } else {
      msgObj = new Array();
      msgObj.push("My commands are: k! +");
      for (const command of commands) {
        msgObj.push("`" + command.name + "`");
      }
    }

    message.reply(msgObj, { whispered: true, mentionUser: true });
  },
};
