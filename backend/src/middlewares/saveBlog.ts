import s3 from '../utils/storageClient';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import getClient from '../utils/db';
import addBlogNotificationJob from './addNotificationJob';
export default async function saveBlog(req:any,res:any,next:any) {
    try{
    const {post_id,rawContent}=req.body;
    console.log(req.body);
    const id=parseInt(post_id.id);
    const client=await getClient();
    const checkPostQuery=`SELECT filename AS filename FROM blogs WHERE id=$1;`;
    const response=await client?.query(checkPostQuery,[id]);
    console.log(`response for id ${post_id}:`+response?.rows[0]);
    if(!response?.rows[0]) return res.status(400).json({msg:'post not found',response});
    const filename=response?.rows[0].filename;
        const mappedBlocks=rawContent.blocks.map(
        (block:any)=>(!block.text.trim() && '\n') || block.text
    );
    let plainText='';
    for(let i=0; i<mappedBlocks.length; i++) {
        const block=mappedBlocks[i];
        if(i===mappedBlocks.length-1) {
            plainText+=block;
        }else {
            if(block==='\n') plainText+=block;
            else plainText+=block+'\n';
        }
    }
    const editorContent=JSON.stringify(rawContent);
    const uploadParams= {
        Bucket: process.env.BUCKET!,
        Key: filename,
        Body: editorContent,
        ContentType: 'application/json'
    };
    const uploadCommand=new PutObjectCommand(uploadParams);
    const response2= await s3.send(uploadCommand);
    console.log(response2); 
    addBlogNotificationJob(id);
    return res.status(200).json({msg:'blog submitted successfully'});
    }catch(err){
        next(err);
    }

}
