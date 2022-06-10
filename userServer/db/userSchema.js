const {  DataTypes } = require('sequelize');
const db = require('./config');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false

    }
  }, {
    freezeTableName: true,
});
module.exports = User;
