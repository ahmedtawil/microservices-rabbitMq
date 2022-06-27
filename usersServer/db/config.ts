import { Sequelize } from 'sequelize';
import dotenv , {DotenvConfigOptions} from 'dotenv';
const options : DotenvConfigOptions = {path: './configs/config.env' };
dotenv.config(options)

const USERS_SERVER_DB_URI : String = process.env.USERS_SERVER_DB_URI
const sequelize : Sequelize = new Sequelize(USERS_SERVER_DB_URI) ;
export default sequelize;
