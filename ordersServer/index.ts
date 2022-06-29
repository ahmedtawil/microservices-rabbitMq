import path from 'path';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import express, { Express, Request, Response, Application } from 'express';
import amqp, { Connection, Channel } from 'amqplib';

import db from './db/config';
const app: Express = express();
import rabbitMq from './rabbitMq/consumer';
import User from './db/userSchema';
import { messages, errorMessages } from '../constants';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { Model } from 'sequelize/types';
let channel: Channel;

const options: DotenvConfigOptions = { path: './configs/config.env' };
dotenv.config(options)


const createNewUser = async (msg: any) => {
    await User.create(msg);
    console.log(messages.USER.successfullyCreateNewUser);
}

const deactivateUser = async (msg: any) => {
    const { id: userID } = msg;
    const user = await User.findByPk(userID);
    if (!user) return;
    await user.destroy();
    console.log(messages.USER.successfullyDeactivatedUser);
}

const handeleUsersQm = (data: any) => {
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

}

app.listen(process.env.ORDERS_SERVER_PORT, async () => {
    console.log(`${messages.SERVER.connection} : ${process.env.ORDERS_SERVER_PORT}`);
    try {
        await db.authenticate();
        console.log(messages.SERVER.connection);
        await db.sync({ force: true });

        channel = await rabbitMq();

        const req = await axios.get('http://localhost:3000/internal/users/list/get');
        const { users } = req.data;
        await User.bulkCreate(users);

        channel.consume(process.env.RABBITMQ_QEUE_NAME, (msg) => {
            handeleUsersQm(msg);
            channel.ack(msg);
        });


    } catch (error) {
        console.error(errorMessages.DB.connection, error);
        process.exit(0);
    }

});

