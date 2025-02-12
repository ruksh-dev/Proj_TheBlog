import getClient from '../utils/db';
export default  async function checkBookmark(req:any, res:any, next:any) {
    try{
        const userId=req.user.id;
        const postId=req.params.id;
        const checkBookmarkQuery=`SELECT * FROM user_bookmarks WHERE blog_id=$1 AND user_id=$2;`;
        const client=await getClient();
        const queryResponse=await client?.query(checkBookmarkQuery,[postId,userId]);
        if(queryResponse?.rows[0]) return res.status(200).json({value: true});
        return res.status(200).json({value: false});
    }catch(err){
        next(err);
    }
}
