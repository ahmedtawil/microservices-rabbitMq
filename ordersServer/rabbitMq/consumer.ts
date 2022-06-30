import amqp, { Connection, Channel } from 'amqplib';
const RABBITMQ_SERVER_URI: string = process.env.RABBITMQ_SERVER_URI
const RABBITMQ_QUEUE_NAME: string = process.env.RABBITMQ_QUEUE_NAME

const connect = async (): Promise<Channel | undefined> => {
    let channel: Channel | undefined;
    try {
        const connection: Connection = await amqp.connect();
        channel = await connection.createChannel(RABBITMQ_SERVER_URI);
        await channel.assertQueue(RABBITMQ_QUEUE_NAME);

    } catch (error) {
        console.log(error);
    }
    return channel;
}
export default connect
