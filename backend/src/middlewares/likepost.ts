import getClient from '../utils/db';
export default async function likePost(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        const userId=req.user.id;
        const insertPostLikeQuery=`INSERT INTO blog_likes (blog_id,user_id) VALUES ($1,$2) ON CONFLICT (blog_id,user_id) DO NOTHING;`;
        const client=await getClient();
        const queryResponse=await client?.query(insertPostLikeQuery,[postId,userId]);
        return res.status(200).json({msg:'blog likes successfully'});    
    }catch(err){
        next(err);
    }
}
