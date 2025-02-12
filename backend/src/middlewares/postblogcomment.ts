import getClient from '../utils/db';
import moment from 'moment-timezone';
export default async function postBlogComment(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        const userId=req.user.id; 
        const rawContent=req.body;
        console.log(rawContent)
        const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        console.log(timestamp)
        const getBlogCommentsQuery=`INSERT INTO blog_comments  (blog_id,user_id,username,content,created_at) VALUES ($1,$2,(SELECT username FROM users WHERE id=$2),$3::jsonb,$4);`;
        const client=await getClient();
        const queryResponse=await client?.query(getBlogCommentsQuery,[postId,userId,rawContent,timestamp]);
        return res.status(200).json({msg:'comment posted successfully'});
    }catch(err){
        next(err);
    }
} 
