import getClient from '../utils/db';
export default async function postReplyComment(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        const userId=req.user.id;
        const {content,parentCommentId}=req.body;
        const timestamp=Date.now();
        const getBlogCommentsQuery=`INSERT INTO blog_comments  (blog_id,user_id,username,content,created_at,parent_comment_id) VALUES ($1,$2,(SELECT username FROM users WHERE id=$2),$3,$4,$5);`;
        const client=await getClient();
        const queryResponse=await client?.query(getBlogCommentsQuery,[postId,userId,content,timestamp,parentCommentId]);
        return res.status(200).json({msg:'comment posted successfully'});
    }catch(err){
        next(err);
    }
} 
