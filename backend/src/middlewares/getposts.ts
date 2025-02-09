import getClient from '../utils/db';
const countTrendingPostsQuery=`
SELECT COUNT(DISTINCT b.id) AS total_count FROM blogs b;
`;
const getTrendingPostsQuery=`
  SELECT 
    b.id,
    b.title,
    b.description,
    b.author,
    b.tags,
    b.created_at,
    COALESCE(COUNT(DISTINCT bl.id), 0) as like_count 
  FROM blogs b
  LEFT JOIN blog_views bv ON b.id = bv.blog_id
  LEFT JOIN blog_likes bl ON b.id = bl.blog_id
  LEFT JOIN blog_comments bc ON b.id = bc.blog_id
  GROUP BY b.id, b.title, b.description, b.author, b.created_at
  ORDER BY b.created_at DESC
  LIMIT $1
  OFFSET $2;
`;
const countSearchPostsQuery=`
SELECT COUNT(b.id) AS total_count FROM blogs b WHERE (
 b.title ILIKE $1 || '%'
 OR b.title ILIKE '%' || $1 || '%'
 OR b.description ILIKE $1 || '%'
 OR b.description ILIKE '%' || $1 || '%'
 OR b.tags::text ILIKE $1 || '%'
 ) GROUP BY b.id;
`;
const searchPostsQuery=`
WITH search_results AS (
  SELECT 
    b.id,
    b.title,
    b.description,
    b.author,
    b.tags,
    b.created_at,
    COALESCE(COUNT(DISTINCT bv.id), 0) as view_count,
    COALESCE(COUNT(DISTINCT bl.id), 0) as like_count,
    COALESCE(COUNT(DISTINCT bc.id), 0) as comment_count
  FROM blogs b
  LEFT JOIN blog_views bv ON b.id = bv.blog_id
  LEFT JOIN blog_likes bl ON b.id = bl.blog_id
  LEFT JOIN blog_comments bc ON b.id = bc.blog_id
  WHERE
  (
      b.title ILIKE $1 || '%'  -- Starts with the search term
      OR b.title ILIKE '% ' || $1 || '%'  -- Contains the search term as a word
      OR b.description ILIKE $1 || '%'
      OR b.description ILIKE '% ' || $1 || '%'
      OR b.tags::text ILIKE $1 || '%'
    ) 
  GROUP BY b.id, b.title, b.description, b.author, b.created_at
)
SELECT * FROM search_results
ORDER BY 
  view_count DESC,    
  like_count DESC,    
  comment_count DESC, 
  created_at DESC     
LIMIT $2             
OFFSET $3
;`;

export default async function getPosts(req:any,res:any,next:any){
    try{
        const { term, page = 1, limit = 4 } = req.query;
        const offset=(page-1)*limit; 
        const client=await getClient();
        console.log("term value: "+term);
        let result1,result2;
        if(term && term.length>0) {
            result1=await client?.query(countSearchPostsQuery,[term]);
            result2=await client?.query(searchPostsQuery,[term,limit,offset]);
        }
        else {
            result1=await client?.query(countTrendingPostsQuery);
            result2=await client?.query(getTrendingPostsQuery,[limit,offset]);
        }
        //console.log(result);
        res.status(200).json({'result1':result1, 'result2': result2});
    }catch(err){
        next(err);
    }
}
