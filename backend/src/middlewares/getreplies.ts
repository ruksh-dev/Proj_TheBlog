import getClient from '../utils/db';
export default async function getReplies(req:any,res:any,next:any) {
    try{
        const {id1,id2}=req.params;
        const getCommentRepliesQuery=`SELECT 
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
    blog_comments WHERE blog_id=$1 AND parent_comment_id=$2;`;
        const client=await getClient();
        const queryResponse=await client?.query(getCommentRepliesQuery,[id1,id2]);
        return res.status(200).json({comments: queryResponse!.rows});
    }catch(err){
        next(err);
    }
}
