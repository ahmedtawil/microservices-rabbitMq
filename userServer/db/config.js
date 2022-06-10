const { Sequelize } = require('sequelize');

module.exports = new Sequelize('postgres://postgres:ahmed@localhost:5432/users');
