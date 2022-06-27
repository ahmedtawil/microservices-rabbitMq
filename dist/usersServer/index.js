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
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./db/config"));
const app = (0, express_1.default)();
const producer_1 = __importDefault(require("./rabbitMq/producer"));
const userSchema_1 = __importDefault(require("./db/userSchema"));
const constants_1 = require("../constants");
let channel;
const options = { path: './configs/config.env' };
dotenv_1.default.config(options);
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'client')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile('./index.html');
}));
app.get('/interanl/users/list/get', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userSchema_1.default.findAll();
    res.json({ success: true, users });
}));
app.post('/user/deactivate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = Number(req.body.userID);
    console.log(userID);
    console.log(typeof userID);
    console.log('........................' , userID);
    console.log(isNaN(userID));
    if (userID == undefined || typeof userID != 'number' ) {
        console.log('---------------------------55555555555555555555555');

        return res.json({ success: false, msg: constants_1.errorMessages.USER.invalidUserID });
    }
    const user = yield userSchema_1.default.findByPk(userID);
    if(!user){
        return res.json({ success: false, msg: constants_1.errorMessages.USER.invalidUserID });
    }
    yield user.destroy();
    const msg = Object.assign(Object.assign({}, user.toJSON()), { optType: 'deactivateUser' });
    channel.sendToQueue(process.env.RABBITMQ_QEUE_NAME, Buffer(JSON.stringify(msg)));

    res.json({ success: true, user });
}));
app.post('/user/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (name == undefined || email == undefined || name.trim() == '' || email.trim() == '')
        return res.json({ success: false, msg: constants_1.errorMessages.USER.invalidUserParameters });
    console.log(req.body);
    const user = yield userSchema_1.default.create({ name, email });
    const msg = Object.assign(Object.assign({}, user.toJSON()), { optType: 'createNewUser' });
    channel.sendToQueue(process.env.RABBITMQ_QEUE_NAME, new Buffer(JSON.stringify(msg)));
    res.json({ success: true, user: user.toJSON() });
}));
const USERS_SERVER_PORT = process.env.USERS_SERVER_PORT;
app.listen(USERS_SERVER_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${constants_1.messages.SERVER.connection} : ${process.env.USERS_SERVER_PORT}`);
    try {
        yield config_1.default.authenticate();
        console.log(constants_1.messages.SERVER.connection);
        // await User.sync({ force: true });
        channel = yield (0, producer_1.default)();
    }
    catch (error) {
        console.error(constants_1.errorMessages.DB.connection, error);
        process.exit(0);
    }
}));
