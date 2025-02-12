import getClient from '../utils/db';
import s3 from '../utils/storageClient';
import {GetObjectCommand} from '@aws-sdk/client-s3';
function streamToString(stream:any) {
  return new Promise((resolve, reject) => {
    const chunks:Uint8Array[] = [];
    stream.on("data", (chunk:Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

export default async function getPost(req:any,res:any,next:any) {
    try{
    const postId=req.params.id;
   // const userId=req.user.id;
    const getPostFilenameQuery=`SELECT b.filename as filename, b.user_id as user_id, b.title as title,
             b.author as author, b.tags as tags, b.created_at as created_at, COUNT(bl.id) as likes  FROM blogs b LEFT JOIN blog_likes bl ON b.id=bl.blog_id WHERE b.id=$1 GROUP BY b.id;`;
    const client=await getClient();
    const queryResponse=await client?.query(getPostFilenameQuery,[postId]);
    if(!queryResponse!.rows[0]) return res.status(401).json({msg:'post not found'});
        const getRawContentCommand=new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: queryResponse!.rows[0].filename
        });
        const s3Response=await s3.send(getRawContentCommand);
        const rawContent=await streamToString(s3Response.Body);
        return res.status(200).json({rawContent, metadata: queryResponse!.rows[0]});
    }catch(err){
        next(err);
    }
} 
