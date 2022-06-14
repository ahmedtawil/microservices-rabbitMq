const { Sequelize } = require('sequelize');

module.exports = new Sequelize(process.env.ORDERS_SERVER_DB_URI);
