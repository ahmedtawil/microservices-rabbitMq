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
const amqplib_1 = __importDefault(require("amqplib"));
const RABBITMQ_SERVER_URI = process.env.RABBITMQ_SERVER_URI;
const RABBITMQ_QEUE_NAME = process.env.RABBITMQ_QEUE_NAME;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    let channel;
    try {
        const connection = yield amqplib_1.default.connect();
        channel = yield connection.createChannel(RABBITMQ_SERVER_URI);
        yield channel.assertQueue(RABBITMQ_QEUE_NAME);
    }
    catch (error) {
        console.log(error);
    }
    return channel;
});
exports.default = connect;
