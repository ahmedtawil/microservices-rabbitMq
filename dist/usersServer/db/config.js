"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const options = { path: './configs/config.env' };
dotenv_1.default.config(options);
const USERS_SERVER_DB_URI = process.env.USERS_SERVER_DB_URI;
const sequelize = new sequelize_1.Sequelize(USERS_SERVER_DB_URI);
exports.default = sequelize;
