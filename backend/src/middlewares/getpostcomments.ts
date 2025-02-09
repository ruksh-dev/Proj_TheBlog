import getClient from '../utils/db';
export default async function getPostComments(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        //const userId=req.user.id;
        const getBlogCommentsQuery=`SELECT 
    id,
    user_id,
    username,
    content,
    created_at,
    parent_comment_id,
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
    blog_comments WHERE blog_id=$1;
`;
        const client=await getClient();
        const queryResponse=await client?.query(getBlogCommentsQuery,[postId]);
        return res.status(200).json({comments: queryResponse!.rows});
    }catch(err){
        next(err);
    }
} 
