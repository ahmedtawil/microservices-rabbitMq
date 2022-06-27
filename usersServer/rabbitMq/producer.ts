import amqp, { Connection, Channel } from 'amqplib';

const RABBITMQ_SERVER_URI : string = process.env.RABBITMQ_SERVER_URI
const RABBITMQ_QEUE_NAME : string = process.env.RABBITMQ_QEUE_NAME

const connect  = async () : Promise<Channel | undefined>  => {
    let channel: Channel | undefined;
    try {
        const connection: Connection = await amqp.connect(RABBITMQ_SERVER_URI);
        channel = await connection.createChannel();
        await channel.assertQueue(RABBITMQ_QEUE_NAME);

    } catch (error) {
        console.log(error);
    }
    return channel;
}
export default connect