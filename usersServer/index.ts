import path from 'path';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import express, { Express, Request, Response, Application } from 'express';
import amqp, { Connection, Channel } from 'amqplib';

import db from './db/config';
const app: Express = express();
import rabbitMq from './rabbitMq/producer';
import User from './db/userSchema';
import { messages, errorMessages } from '../constants';
import { Model } from 'sequelize/types';
import Validator from '../middlewares/Validator'
let channel: Channel | undefined;

const options: DotenvConfigOptions = { path: './configs/config.env' };
dotenv.config(options)

app.use(express.static(path.join(__dirname, '../', 'client')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req: Request, res: Response) => {
    res.sendFile('./index.html');
});

app.get('/internal/users/list/get', async (req: Request, res: Response) => {
    const users = await User.findAll();
    res.json({ success: true, users });
});

app.post('/user/deactivate', async (req: Request, res: Response) => {
    const userID: String = req.body.userID;
    if (userID == undefined || typeof userID != 'number') return res.json({ success: false, msg: errorMessages.USER.invalidUserID });
    const user: Model<any, any> | null = await User.findByPk(userID);
    await user.destroy();
    const msg = {
        ...user.toJSON(),
        optType: 'deactivateUser'
    }
    channel.sendToQueue(process.env.RABBITMQ_QEUE_NAME, new Buffer(JSON.stringify(msg)));
    res.json({ success: true });
});

app.post('/user/register', Validator('userSchema', { success: false, msg: errorMessages.USER.invalidUserParameters }), async (req: Request, res: Response) => {
    const { name, email } = req.body;
    console.log(req.body);
    const user = await User.create({ name, email });
    const msg = {
        ...user.toJSON(),
        optType: 'createNewUser'
    }
    channel.sendToQueue(process.env.RABBITMQ_QEUE_NAME, new Buffer(JSON.stringify(msg)));
    res.json({ success: true, user: user.toJSON() });
})

const USERS_SERVER_PORT: string = process.env.USERS_SERVER_PORT
app.listen(USERS_SERVER_PORT, async () => {
    console.log(`${messages.SERVER.connection} : ${process.env.USERS_SERVER_PORT}`);
    try {
        await db.authenticate();
        console.log(messages.SERVER.connection);
        // await User.sync({ force: true });
        channel = await rabbitMq();

    } catch (error) {
        console.error(errorMessages.DB.connection, error);
        process.exit(0);
    }
})


