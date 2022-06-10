
const express = require('express')
const db = require('./db/config')
const app = express()
const rabbitMq = require('./rabbitMq/producer')
let channel = null

const User = require('./db/userSchema')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/interanl/users/list/get', async (req, res) => {
    const users = await User.findAll()
    console.log(users);
    res.json({ success: true, users })

})

app.post('/user/deactivate', async(req, res) => {
    const { userID } = req.body
    const user = await User.findByPk(userID)
    await user.destroy()
    const msg = {
        ...user.toJSON(),
        optType: 'deactivateUser'
    }
    channel.sendToQueue('users', Buffer(JSON.stringify(msg)))
    res.json({ success: true })
})


app.post('/user/register', async (req, res) => {
    const { name, email } = req.body
    const user = await User.create({ name, email })
    const msg = {
        ...user.toJSON(),
        optType: 'createNewUser'
    }
    channel.sendToQueue('users', Buffer(JSON.stringify(msg)))
    res.json({ success: true })
})

app.listen(3000, async () => {
    console.log('users server started at port 3000');
    try {
        await db.authenticate();
        console.log('DB connection has been established successfully.');
       // await User.sync({ force: true });
        channel = await rabbitMq.connect()

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(0)
    }
})


