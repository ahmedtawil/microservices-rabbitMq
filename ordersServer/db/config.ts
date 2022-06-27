import { Sequelize } from 'sequelize';
import dotenv , {DotenvConfigOptions} from 'dotenv';
const options : DotenvConfigOptions = {path: './configs/config.env' };
dotenv.config(options)

const ORDERS_SERVER_DB_URI : string = process.env.ORDERS_SERVER_DB_URI
const sequelize : Sequelize = new Sequelize(ORDERS_SERVER_DB_URI) ;
export default sequelize;
