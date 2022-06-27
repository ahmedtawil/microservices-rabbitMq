"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
require('dotenv').config({ path: './configs/config.env' });
const express_1 = __importDefault(require("express"));
const db = require('./db/config');
const app = (0, express_1.default)();
const rabbitMq = require('./rabbitMq/producer');
const User = require('./db/userSchema');
const { messages, errorMessages } = require('../constants');
let channel = null;
app.use(express_1.default.static(path.join(__dirname, '../', 'client')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile('./index.html');
}));
app.get('/interanl/users/list/get', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.findAll();
    res.json({ success: true, users });
}));
app.post('/user/deactivate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.body;
    console.log(isNaN(Number(userID)));
    if (userID == undefined || typeof userID != 'number')
        return res.json({ success: false, msg: errorMessages.USER.invalidUserID });
    const user = yield User.findByPk(userID);
    yield user.destroy();
    const msg = Object.assign(Object.assign({}, user.toJSON()), { optType: 'deactivateUser' });
    channel.sendToQueue(process.env.RABBITMQ_QEUE_NAME, Buffer(JSON.stringify(msg)));
    res.json({ success: true });
}));
app.post('/user/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (name == undefined || email == undefined || name.trim() == '' || email.trim() == '')
        return res.json({ success: false, msg: errorMessages.USER.invalidUserParameters });
    console.log(req.body);
    const user = yield User.create({ name, email });
    const msg = Object.assign(Object.assign({}, user.toJSON()), { optType: 'createNewUser' });
    channel.sendToQueue(process.env.RABBITMQ_QEUE_NAME, Buffer(JSON.stringify(msg)));
    res.json({ success: true, user: user.toJSON() });
}));
app.listen(process.env.USERS_SERVER_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${messages.SERVER.connection} : ${process.env.USERS_SERVER_PORT}`);
    try {
        yield db.authenticate();
        console.log(messages.SERVER.connection);
        // await User.sync({ force: true });
        channel = yield rabbitMq.connect();
    }
    catch (error) {
        console.error(errorMessages.DB.connection, error);
        process.exit(0);
    }
}));
