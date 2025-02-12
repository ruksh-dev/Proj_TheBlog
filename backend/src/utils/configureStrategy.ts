import passport from 'passport';
import {Strategy as GoogleStrategy, Profile} from 'passport-google-oauth20';
import getClient from '../utils/db';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});


export default  function configureStrategy() {
// configure google oAuth2 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
}, 
    // callback function to handle user/admin authentication based on state parameter
  async function(req:any, accessToken:string, refreshToken:(string | null), profile:Profile, cb:(err:any, user?:Express.User)=>void) {
      // based on state value(string type), we pass or create the user/admin object 
      const state=req.query.state;
      console.log(profile,state);
      try{
          let user;
          const client=await getClient();
      if(profile.emails) {
        if(state==='user') {
          //console.log('running user authentication...');
          const checkUserQuery=`SELECT * FROM users WHERE id=$1;`;
          user=await client?.query(checkUserQuery,[profile.id]);
          //console.log(user);
          if(user?.rows[0]){
             // console.log(user.rows[0]);
              return cb(null,user.rows[0]); 
          }
          else{
              const createUserQuery=`INSERT INTO users (id,username,email) VALUES ($1,$2,$3) RETURNING *;`;
              user=await client?.query(createUserQuery,[profile.id,profile.displayName,profile.emails[0].value]);
              //console.log(user?.rows[0]);
              return cb(null,user!.rows[0]);
          }    
          }else {
              const checkAdminQuery=`SELECT * FROM admins WHERE id=$1;`;
              user=await client?.query(checkAdminQuery,[profile.id]);
              if(user?.rows[0]) return cb(null,user.rows[0]);
              else {
                  const createAdminQuery=`INSERT INTO admins (id,username,email) VALUES ($1,$2,$3) RETURNING *;`;
                  user=await client?.query(createAdminQuery,[profile.id,profile.displayName,profile.emails[0].value]);
                  return cb(null,user!.rows[0]);
              }
          }
      }
      }catch(err) {
          return cb(err);
      }
  }
));

// serialize user-info into session
passport.serializeUser((user:any, done) => { 
  done(null, user); 
}); 

// de-serialize user from session
passport.deserializeUser((user:any, done) => { 
  done(null, user);
});
}





