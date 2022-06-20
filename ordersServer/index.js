
require('dotenv').config({ path: './configs/config.env' });
const express = require('express');
const axios = require('axios');
const rabbitMq = require('./rabbitMq/consumer');
const db = require('./db/config');
const { messages, errorMessages } = require('../constants');
const User = require('./db/userSchema');
let channel = null;

const app = express();


const createNewUser = async (msg) => {
    await User.create(msg);
    console.log(messages.USER.successfullyCreateNewUser);
}

const deactivateUser = async (msg) => {
    const { id: userID } = msg;
    const user = await User.findByPk(userID);
    if (!user) return;
    await user.destroy();
    console.log(messages.USER.successfullyDeactivatedUser);
}

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

}

app.listen(process.env.ORDERS_SERVER_PORT, async () => {
    console.log(`${messages.SERVER.connection} : ${process.env.ORDERS_SERVER_PORT}`);
    try {
        await db.authenticate();
        console.log(messages.SERVER.connection);
        await db.sync({ force: true });

        channel = await rabbitMq.connect();

        const req = await axios('http://localhost:3000/interanl/users/list/get');
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

