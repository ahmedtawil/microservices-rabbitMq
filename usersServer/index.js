
const path = require('path');
require('dotenv').config({ path: './configs/config.env' });
const express = require('express');
const db = require('./db/config');
const app = express();
const rabbitMq = require('./rabbitMq/producer');
const User = require('./db/userSchema');
const { messages , errorMessages} = require('../constants')
let channel = null;

app.use(express.static(path.join(__dirname, '../', 'client')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    res.sendFile('./index.html');
});

app.get('/interanl/users/list/get', async (req, res) => {
    const users = await User.findAll();
    res.json({ success: true, users });
});

app.post('/user/deactivate', async (req, res) => {
    const { userID } = req.body;
    const user = await User.findByPk(userID);
    await user.destroy();
    const msg = {
        ...user.toJSON(),
        optType: 'deactivateUser'
    }
    channel.sendToQueue(process.env.RABBITMQ_QEUE_NAME, Buffer(JSON.stringify(msg)));
    res.json({ success: true, user });
});

app.post('/user/register', async (req, res) => {
    const { name, email } = req.body;
    console.log(req.body);
    const user = await User.create({ name, email });
    const msg = {
        ...user.toJSON(),
        optType: 'createNewUser'
    }
    channel.sendToQueue(process.env.RABBITMQ_QEUE_NAME, Buffer(JSON.stringify(msg)));
    res.json({ success: true, user: user.toJSON() });
})

app.listen(process.env.USERS_SERVER_PORT, async () => {
    console.log(`${messages.SERVER.connection} : ${process.env.USERS_SERVER_PORT}`);
    try {
        await db.authenticate();
        console.log(messages.SERVER.connection);
        // await User.sync({ force: true });
        channel = await rabbitMq.connect();

    } catch (error) {
        console.error(errorMessages.DB.connection, error);
        process.exit(0);
    }
})


