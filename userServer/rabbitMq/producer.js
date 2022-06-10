const amqp = require('amqplib')

const connect = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')
        const channel = await connection.createChannel()
        const result = await channel.assertQueue('users')
        return channel

    } catch (error) {
        console.log(error);

    }
}

module.exports = {connect}