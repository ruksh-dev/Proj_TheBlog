import {Client} from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname,'../../.env')});

const config = {
    user: process.env.LOCALDB_USER,
    password: process.env.LOCALDB_PASSWORD,
    host: process.env.LOCALDB_HOST,
    port: Number(process.env.LOCALDB_PORT),
    database: process.env.LOCALDB_NAME,
    // ssl: {
    //     rejectUnauthorized: true,
    //     ca: process.env.DB_CERT,
    // },
};
export default async function getClient(){
    try{
const client = new Client(config);
await client.connect();
console.log('connected to db');
return client;
    }catch(err){
        console.log(err);
    }
}
