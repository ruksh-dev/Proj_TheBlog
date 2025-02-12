import getClient from '../utils/db';
export default async function unLikePost(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        const userId=req.user.id;
        const insertPostLikeQuery=`DELETE FROM blog_likes WHERE blog_id=$1 AND user_id=$2;`;
        const client=await getClient();
        const queryResponse=await client?.query(insertPostLikeQuery,[postId,userId]);
        return res.status(200).json({msg:'blog unliked successfully'});    
    }catch(err){
        next(err);
    }
}
