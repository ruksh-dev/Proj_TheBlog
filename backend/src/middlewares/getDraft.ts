import getClient from '../utils/db';
import s3 from '../utils/storageClient';
import {GetObjectCommand} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname,'../../.env')});
async function getContentUrl(postId:string, userId:string){
    const client=await getClient();
    // first check whether, this user has this post or not
    const getUrlQuery=`SELECT filename AS filename FROM blogs WHERE id=$1 AND user_id=$2;`;
    const response=await client?.query(getUrlQuery,[postId,userId]);
    console.log(response?.rows[0]);
    return (response?.rows[0].filename)?response.rows[0].filename:null;
}

function streamToString(stream:any) {
  return new Promise((resolve, reject) => {
    const chunks:Uint8Array[] = [];
    stream.on("data", (chunk:Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

export default async function getDraft(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        const userId=req.user.id;
        const response=await getContentUrl(postId,userId);
        if(!response) return res.status(400).json({msg:'post not found'});
        const getRawContentCommand=new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: response
        });
        const response2=await s3.send(getRawContentCommand);
        console.log("response2: \n",response2);
        const fileContent=await streamToString(response2.Body);
        console.log("filecontent: \n",fileContent);
        return res.status(200).json({contentData: fileContent});
    }catch(err){
        next(err);
    }
}
