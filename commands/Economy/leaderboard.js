module.exports = {
  name: "leaderboard",
  description: "Leaderboard",
  execute: (message, args, currency, Users, ItemShop, app) => {
    return message.reply(
      currency
        .sort((a, b) => b.balance - a.balance)
        .filter((user) => app.users._userControllerCache.has(user.user_id))
        .first(5)
        .map(
          (user, position) =>
            `(${position + 1}) ${
              app.users._userControllerCache.get(user.user_id).displayName
            }: ${user.balance}:CryptoDOGE: `
        )
        .join("\n"),
      { mentionUser: false }
    );
  },
};
