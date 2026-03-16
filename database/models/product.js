const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database");

const Product = sequelize.define("Product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: DataTypes.TEXT,
  price: DataTypes.INTEGER,
  discont_price: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  image: DataTypes.TEXT,
  full_price: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.discont_price !== null ? this.discont_price : this.price;
    },
  },
});

module.exports = Product;
