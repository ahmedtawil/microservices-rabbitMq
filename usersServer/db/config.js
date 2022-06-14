const { Sequelize } = require('sequelize');

module.exports = new Sequelize(process.env.USERS_SERVER_DB_URI);
