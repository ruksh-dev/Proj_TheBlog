import getClient from '../utils/db';
export default async function isPostLiked(req:any,res:any,next:any) {
    try{
    const postId=req.params.id;
    const userId=req.user.id;
    console.log('postid:',postId);
    console.log('userId:',userId);
    const client=await getClient();
    const isPostLikedQuery=`SELECT id from blog_likes WHERE blog_id=$1 AND user_id=$2;`;
    const queryResponse=await client?.query(isPostLikedQuery,[postId,userId]);
    console.log(queryResponse);
    if(queryResponse && !queryResponse.rows[0]) return res.status(200).json({liked: false});
    return res.status(200).json({liked:true});
    }catch(err){
        next(err);
    }
}
