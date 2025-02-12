import getClient from '../utils/db';
export default  async function bookmark(req:any, res:any, next:any) {
    try{
        const userId=req.user.id;
        const postId=req.params.id;
        const {isBookmark}=req.body;
        const client=await getClient();
        let msg;
        if(isBookmark){
            const removeBookmarkQuery=`DELETE FROM user_bookmarks WHERE blog_id=$1 AND user_id=$2;`;
            const queryResponse=await client?.query(removeBookmarkQuery,[postId,userId]);
            msg='bookmark remove successfully';
        }else{
            const addBookmarkQuery=`INSERT INTO user_bookmarks (blog_id, user_id) VALUES ($1,$2);`;
            const queryResponse=await client?.query(addBookmarkQuery,[postId,userId]);
            msg='bookmark added successfully';
        }
        return res.status(200).json({msg});
            }catch(err){
        next(err);
    }
}
