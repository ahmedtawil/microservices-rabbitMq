const amqp = require('amqplib')

const connect = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER_URI);
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.RABBITMQ_QEUE_NAME);
        return channel

    } catch (error) {
        console.log(error);

    }
}

module.exports = { connect };