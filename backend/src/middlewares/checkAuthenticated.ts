import jwt from 'jsonwebtoken';
import path from 'path';
import getClient from '../utils/db';
require("dotenv").config({path: path.resolve(__dirname, '../../.env')});
const jwtSecret=process.env.SESSION_SECRET as string;
async function checkAuthenticated(req:any,res:any,next:any) {
    try{
        req.body.isAuth=false;
    if(req.isAuthenticated()){
        req.body.isAuth=true;
        req.body.profile=req.user;
        next();
    }else {
        //console.log("1",req.cookies.authToken);
        const token=req.cookies.authToken;
            const decoded=jwt.verify(token,jwtSecret) as {id:string,username:string,email:string};
            //console.log("decoded:", decoded);
            const client=await getClient();
            const checkValidUserQuery=`SELECT id,email,username FROM users WHERE id=$1 AND email=$2;`;
            const response=await client?.query(checkValidUserQuery,[decoded.id,decoded.email]);
            if(response?.rows[0].id) {
                const profile={
                    id: response?.rows[0].id,
                    username: response?.rows[0].username,
                    email: response?.rows[0].email
                };
                console.log("profile",profile);
                req.body.isAuth=true;
                req.body.profile=profile;
            }
        next();
    }
}catch(err){
    next(err);
}
}
export default checkAuthenticated;
