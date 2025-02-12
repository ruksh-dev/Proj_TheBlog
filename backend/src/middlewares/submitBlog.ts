import s3 from '../utils/storageClient';
import getClient from '../utils/db';
export default async function saveBlog(req:any,res:any,next:any) {
    try{
    const {post_id,filename,rawContent,state}=req.body;
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

    const uploadParams= {
        Bucket: process.env.BUCKET!,
        Key: filename,
        Body: rawContent,
        ContentType: 'application/json'
    };
    const [response,client]= await Promise.all([
        s3.putObject(uploadParams),
        getClient()
    ]);
    console.log(response);
    if(state==='post') {
        const updatePostQuery=`
        UPDATE blogs SET state=$1 WHERE id=$2 RETURNING id
        `;
        const values=['completed',post_id];
        const response2=await client?.query(updatePostQuery,values);
        console.log(response2);
    }
    return res.status(200).json({msg:'blog submitted successfully'});
    }catch(err){
        next(err);
    }

}
