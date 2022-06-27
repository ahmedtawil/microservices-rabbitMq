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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./db/config"));
const app = (0, express_1.default)();
const consumer_1 = __importDefault(require("./rabbitMq/consumer"));
const userSchema_1 = __importDefault(require("./db/userSchema"));
const constants_1 = require("../constants");
const axios_1 = __importDefault(require("axios"));
let channel;
const options = { path: './configs/config.env' };
dotenv_1.default.config(options);
const createNewUser = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    yield userSchema_1.default.create(msg);
    console.log(constants_1.messages.USER.successfullyCreateNewUser);
});
const deactivateUser = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userID } = msg;
    const user = yield userSchema_1.default.findByPk(userID);
    if (!user)
        return;
    yield user.destroy();
    console.log(constants_1.messages.USER.successfullyDeactivatedUser);
});
const handeleUsersQm = (data) => {
    const msg = JSON.parse(data.content.toString());
    const { optType } = msg;
    switch (optType) {
        case 'createNewUser':
            createNewUser(msg);
            break;
        case 'deactivateUser':
            deactivateUser(msg);
            break;
    }
};
app.listen(process.env.ORDERS_SERVER_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${constants_1.messages.SERVER.connection} : ${process.env.ORDERS_SERVER_PORT}`);
    try {
        yield config_1.default.authenticate();
        console.log(constants_1.messages.SERVER.connection);
        yield config_1.default.sync({ force: true });
        channel = yield (0, consumer_1.default)();
        const req = yield axios_1.default.get('http://localhost:3000/interanl/users/list/get');
        const { users } = req.data;
        yield userSchema_1.default.bulkCreate(users);
        channel.consume(process.env.RABBITMQ_QEUE_NAME, (msg) => {
            handeleUsersQm(msg);
            channel.ack(msg);
        });
    }
    catch (error) {
        console.error(constants_1.errorMessages.DB.connection, error);
        process.exit(0);
    }
}));
