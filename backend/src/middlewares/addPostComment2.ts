import getClient from '../utils/db';
import moment from 'moment-timezone';
import {clients} from '../clients';
interface clientT {
    id: string;
    postId: string;
    res: any;
}
const updatePostCommentsQuery=`SELECT 
    id,
    user_id,
    username,
    content,
    created_at,
    CASE
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 60 THEN 
            EXTRACT(EPOCH FROM NOW() - created_at)::INT || 's ago'
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 3600 THEN 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 60)::INT || 'min ago'
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 86400 THEN 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 3600)::INT || 'h ago'
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 2592000 THEN 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 86400)::INT || 'd ago'
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 31536000 THEN 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 2592000)::INT || 'months ago'
        ELSE 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 31536000)::INT || 'years ago'
    END AS formatted_created_at
FROM 
    blog_comments WHERE blog_id=$1 AND parent_comment_id IS NULL;`;
export async function addPostComment(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        const userId=req.user.id;
        const rawContent=req.body;
        const timestamp=moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        const getBlogCommentsQuery=`INSERT INTO blog_comments  (blog_id,user_id,username,content,created_at) VALUES ($1,$2,(SELECT username FROM users WHERE id=$2),$3::jsonb,$4);`;
        const pgclient=await getClient();
        const queryResponse1=await pgclient?.query(getBlogCommentsQuery,[postId,userId,rawContent,timestamp]);
        res.json({msg:'comment posted successfully'});
        const queryResponse2=await pgclient?.query(updatePostCommentsQuery,[postId]);
    clients.forEach((client:clientT)=>{
        if(client.postId===postId) {
            client.res.write(`data: ${JSON.stringify(queryResponse2!.rows)}\n\n`);
        }
    });
    }catch(err){
        next(err);
    }
}

export async function addCommentReply(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        const userId=req.user.id;
        const {rawContent,parentCommentId}=req.body;
        if(!parentCommentId) return res.status(401).json({msg:'parent comment id not found'});
        const timestamp=moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        const getBlogCommentsQuery=`INSERT INTO blog_comments  (blog_id,user_id,username,content,created_at,parent_comment_id) VALUES ($1,$2,(SELECT username FROM users WHERE id=$2),$3::jsonb,$4,$5);`;
        const pgclient=await getClient();
        const queryResponse1=await pgclient?.query(getBlogCommentsQuery,[postId,userId,rawContent,timestamp,parentCommentId]);
        res.json({msg:'comment posted successfully'});
        const queryResponse2=await pgclient?.query(updatePostCommentsQuery,[postId]);
    clients.forEach((client:clientT)=>{
        if(client.postId===postId) {
            client.res.write(`data: ${JSON.stringify(queryResponse2!.rows)}\n\n`);
        }
    });

    }catch(err){
        next(err);
    }
}
