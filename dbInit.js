const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const ItemShop = require("./models/ItemShop")(sequelize, Sequelize.DataTypes);
require("./models/Users")(sequelize, Sequelize.DataTypes);
require("./models/UserItems")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize
  .sync({ force })
  .then(async () => {
    const shop = [
      ItemShop.upsert({ name: "Yubi", cost: 1 }),
      ItemShop.upsert({ name: "YubiYubi", cost: 2 }),
      ItemShop.upsert({ name: "BFG (probably)", cost: 20 }),
    ];
    await Promise.all(shop);
    console.log("Database synced");
    sequelize.close();
  })
  .catch(console.error);
