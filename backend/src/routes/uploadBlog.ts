import s3 from '../utils/storageClient';
import getClient from '../utils/db';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import {Router} from 'express';
const router=Router();

async function uploadRawContent(command:any) {
    const response=await s3.send(command);
    console.log(response);
}

async function intializeClient() {
    const client=await getClient();
    return client;
}
router.get('/upload', async (req, res, next)=> {
    try{
    const {username,title,tags,rawContent}=req.body;
    const tagsJSON=JSON.stringify(tags);
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
    const date=new Date();
    const filename=`${title}_${date.toString()}`;
    console.log(plainText);
        const uploadParams= {
        Bucket: process.env.BUCKET!,
        Key: filename,
        Body: rawContent
    };
    const uploadCommand=new PutObjectCommand(uploadParams);
    const url=`${process.env.ENDPOINT}/${process.env.BUCKET}/${encodeURIComponent(filename)}`;
    const insertPostQuery=`INSERT INTO posts (author,title,excerpt,content_url,tags,published_date) VALUES ($1,$2,$3,$4::jsonb,$5)`;
    const values=[username,title,plainText,url,tagsJSON,date.toString()];
    const [_,client]= await Promise.all([
            uploadRawContent(uploadCommand),
            intializeClient()
    ]);
    const response=await client!.query(insertPostQuery,values);
    console.log(response);
    res.status(200).json({msg:'blog uploaded successfully'});
    }catch(err){
        next(err);
    }
});
