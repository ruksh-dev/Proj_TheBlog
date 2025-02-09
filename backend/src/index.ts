import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
const pgSession=connectPgSimple(session);
import {Pool} from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import configureStrategy from './utils/configureStrategy';
import {handleError} from './middlewares/handleError';
import {allRoutes} from './routes/index';
dotenv.config({path: path.resolve(__dirname,'../.env')});
const PORT=process.env.PORT;
const app=express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
const pool=new Pool({
    user: process.env.LOCALDB_USER,
    password: process.env.LOCALDB_PASSWORD,
    host: process.env.LOCALDB_HOST,
    port: Number(process.env.LOCALDB_PORT),
    database: process.env.LOCALDB_NAME,
    // ssl: {
    //     rejectUnauthorized: true,
    //     ca: process.env.DB_CERT,
    // },
});
const sessionStore = new pgSession({
  pool,
  tableName: 'session',
  createTableIfMissing: true,
  pruneSessionInterval: 60 * 15 // Cleanup every 15 minutes
});

app.use(express.json());
app.use( 
  session({
    store: sessionStore,
    resave: false, 
    saveUninitialized: false, 
    secret: process.env.SESSION_SECRET!,
      cookie:{
          secure: false,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: 'lax'
      }
  }) 
); 

// Intialize passport google-oauth2-strategy
app.use(passport.initialize()) 
app.use(passport.session()); 
configureStrategy();


app.use(allRoutes);
app.use(handleError);
app.listen(PORT,()=>console.log('server running on PORT'+PORT+'....'));
