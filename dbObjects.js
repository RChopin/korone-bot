const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Users = require("./models/Users")(sequelize, Sequelize.DataTypes);
const ItemShop = require("./models/ItemShop")(sequelize, Sequelize.DataTypes);
const UserItems = require("./models/UserItems")(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(ItemShop, { foreignKey: "item_id", as: "item" });

/* eslint-disable-next-line func-names */
Users.prototype.addItem = async function (item) {
  const useritem = await UserItems.findOne({
    where: { user_id: this.user_id, item_id: item.id },
  });

  if (useritem) {
    useritem.amount += 1;
    return useritem.save();
  }

  return UserItems.create({
    user_id: this.user_id,
    item_id: item.id,
    amount: 1,
  });
};

/* eslint-disable-next-line func-names */
Users.prototype.getItems = function () {
  return UserItems.findAll({
    where: { user_id: this.user_id },
    include: ["item"],
  });
};

module.exports = { Users, ItemShop, UserItems };
