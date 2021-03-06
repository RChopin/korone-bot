const { wrap, raw } = require("@dogehouse/kebab");

module.exports = {
  name: "kick",
  description: "Kick user",
  execute: async (message, args) => {
    let username;

    if (args[0][0] == "@") {
      username = args[0].slice(1);
    } else username = args[0];

    message.reply(`${username} banned from room.`, { mentionUser: false });

    const wrapper = wrap(
      await raw.connect(
        process.env.DOGEHOUSE_TOKEN,
        process.env.DOGEHOUSE_REFRESH_TOKEN,
        {}
      )
    );

    wrapper.query
      .getUserProfile(username)
      .then((user) => {
        wrapper.mutation.blockFromRoom(user.id);
      })
      .catch((error) => {
        console.log(error);
      });

    return;
  },
};
