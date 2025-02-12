import getClient from '../utils/db';
export default async function showDrafts(req:any,res:any,next:any) {
    try{
        const userId=req.user?.id || req.body.profile.id;
        const client=await getClient();
        const getPostsQuery=`SELECT json_agg(posts) AS posts FROM (SELECT id AS id,author AS author,title AS title,description AS description,tags AS tags FROM blogs WHERE user_id=$1 AND state=$2) AS posts;`;
        const response=await client?.query(getPostsQuery,[userId,'incomplete']);
        console.log(response);
        return res.status(200).json({post: response?.rows[0].posts});
    }catch(err){
        next(err);
    }
}
