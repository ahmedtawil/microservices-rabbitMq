
const express = require('express');
const axios = require('axios');
const rabbitMq = require('./rabbitMq/consumer');
const db = require('./db/config');
const User = require('./db/userSchema');

const app = express();
let channel = null;

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

const createNewUser = async (msg) => {
    await User.create(msg);
    console.log('new user created successfully');
}

const deactivateUser = async (msg) => {
    const { id: userID } = msg;
    const user = await User.findByPk(userID);
    if(!user) return;
    await user.destroy();
    console.log('user deactivate successfully');
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

app.listen(5000, async () => {
    console.log('orders server started at port 5000');
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
        await db.sync({ force: true });

        channel = await rabbitMq.connect();

        const req = await axios('http://localhost:3000/interanl/users/list/get');
        const { users } = req.data;
        await User.bulkCreate(users);

        channel.consume('users', (msg) => {
            handeleUsersQm(msg);
            channel.ack(msg);
        });


    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(0);
    }

});

