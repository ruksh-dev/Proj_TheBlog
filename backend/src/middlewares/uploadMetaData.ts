import getClient from '../utils/db';
import s3 from '../utils/storageClient';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname,'../../.env')});
export default async function handleMetaData(req:any,res:any,next:any) {
    try{
        console.log('printing user information')
        console.log(req.user,',\n',req.session);
        const userId=req.user?.id || req.body.profile.id;
        const {title, author, description, tags}=req.body.metadata;
        const rawContent=req.body.rawContent;
        const tagsArray=tags.split(',').map((item:string)=>item.trim());
        const tagsJson=JSON.stringify(tagsArray);
        const date=new Date();
        const filename=`${title}_${date.toISOString()}`.replace(/[^a-zA-Z0-9-_]/g, '_');
        const [client,url]=await Promise.all([
            getClient(),
            uploadRawContent(filename,rawContent)
        ]);
        const postIdQuery=`INSERT INTO blogs (user_id,author,title,description,filename,tags) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;`;
        const values=[userId,author,title,description,filename,tagsJson];
        const response=await client?.query(postIdQuery,values);
        console.log("postIdQuery response: "+JSON.stringify(response));
        return res.status(200).json({id:response?.rows[0].id,key:filename});
    }catch(err){
        next(err);
    }
}
 
async function uploadRawContent(filename:string,rawContent:any) {
        
        console.log(rawContent,'\n',filename);
        const params={
            Bucket: process.env.BUCKET!,
            Key: filename,
            Body: rawContent,
            ContentType: 'application/json'
        }
         const uploadCommand=new PutObjectCommand(params);
         const response=await s3.send(uploadCommand);
        //const response=await s3.putObject(params);
    console.log(response);
        return `${process.env.ENDPOINT}/${process.env.BUCKET}/${encodeURIComponent(filename)}`;
}
