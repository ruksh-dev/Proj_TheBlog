import getClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import path from 'path';
require("dotenv").config({path: path.resolve(__dirname, '../../.env')});
const jwtSecret=process.env.SESSION_SECRET as string;
const checkExistingUserQuery=`SELECT id FROM users WHERE email=$1;`;
const Signup=async (req:any,res:any,next:any)=>{
    try{
    const {username,useremail,password}=req.body;
    const client=await getClient();
      const response1=await client?.query(checkExistingUserQuery,[useremail]);
      console.log(response1?.rows[0]);
      if(response1?.rows[0]) return res.status(401).json({msg:'email already registered!'});
      const userId = uuidv4();
      const saveUserQuery=`INSERT INTO users (id,username,email,password,status) VALUES ($1,$2,$3,$4,$5);`;
      const response2=await client?.query(saveUserQuery,[userId,username,useremail,password,false]);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sheeturao1@gmail.com',
          pass: 'qjey xyyg waza cvvx'
        }
      });
      
      const token = jwt.sign({
        id: userId, 
		useremail,
	}, jwtSecret, { expiresIn: '10m' }
);
const verificationLink=`http://localhost:3000/verify/${token}`;
const mailOptions = {
    from: 'rukshrao11@gmail.com',
    to: useremail,
    subject: 'Verify Your Email',
    text: `Please click on the link below to verify your email: ${verificationLink}`,
    html: `<p>Please click on the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`
  };
  transporter.sendMail(mailOptions, function(error, info){ 
	if (error) next(error);
	console.log('Email Sent Successfully'); 
	console.log(info); 
});
return res.status(200).json({msg:'new user created!'});
    }catch(err){
        next(err);
    }

}

const TokenVerifier=async (req:any,res:any,next:any)=>{
    try{
    const token=req.params.token;
    const {isRemember}=req.body;
    const decoded=jwt.verify(token,jwtSecret) as {id:string, useremail:string};
    // verify email from db
    // if verified , set user status verified in db
    const client=await getClient();
    const updateUserStatusQuery=`UPDATE users SET status = true WHERE email = $1 AND id=$2;`;
    const response=await client?.query(updateUserStatusQuery,[decoded.useremail,decoded.id]);
    console.log(response);
    return res.status(200).json({msg:'user email verified successfully'});

    
}catch(err) {
    next(err);
}

}

const CheckUserStatus=async(req:any,res:any,next:any)=>{
    try{
        const {email}=req.body;
        const client=await getClient();
        const checkUserStatus=`SELECT status FROM users WHERE email=$1;`;
        const response=await client?.query(checkUserStatus,[email]);
        let status=(response!.rows.length>0) ? response?.rows[0].status : false;
        res.status(200).json({status});
    }catch(err){
        next(err);
    }
}

const Signin=async (req:any,res:any,next:any)=>{
    try{
        const {useremail,password}=req.body;
        const client=await getClient();
        const getUserProfileQuery=`SELECT id,email,username FROM users WHERE email=$1 AND password=$2;`;
        const response=await client?.query(getUserProfileQuery,[useremail,password]);
        console.log(response);
        if(!response?.rows[0]) return res.status(404).json({msg:'user not found'});
        const profile={
            id: response?.rows[0].id,
            username: response?.rows[0].username,
            email: useremail
        }
        const token=jwt.sign({
            id: response?.rows[0].id,
            username: response?.rows[0].username,
            email: useremail
        },jwtSecret);
         res.cookie('authToken',token,{httpOnly: true, secure: true, sameSite: 'strict'});
         return res.status(200).json({msg:'login successfull',profile});
    }catch(err){
        next(err);
    }
}

export {Signup, TokenVerifier,CheckUserStatus,Signin}