import getClient from "./db";
async function createTable() {
    try{
     const client=await getClient();
    // const createUsersTableQuery=`
    // CREATE TABLE users (
    // id TEXT PRIMARY KEY,
    // username VARCHAR(255) NOT NULL,
    // email VARCHAR(255) UNIQUE NOT NULL,
    // description TEXT DEFAULT '',
    // followers INT DEFAULT 0,
    // following INT DEFAULT 0
    // );
    // `;
    // await client?.query(createUsersTableQuery);
    // const createBlogsTableQuery=`
    // CREATE TABLE blogs (
    // id SERIAL PRIMARY KEY,
    // user_id TEXT NOT NULL,
    // author VARCHAR(255) NOT NULL,
    // title TEXT NOT NULL,
    // description TEXT NOT NULL,
    // filename TEXT, 
    // tags JSONB DEFAULT '[]'::jsonb,
    // created_at VARCHAR(255) DEFAULT '',
    // updated_date VARCHAR(255) DEFAULT '',
    // state VARCHAR(255) DEFAULT 'incomplete',
    // isReady BOOLEAN DEFAULT FALSE,
    // FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    // );
    // `;
    // await client?.query(createBlogsTableQuery);
    //     // const createBlogTagsTable=`
    //     // CREATE TABLE blog_tags (
    //     // id SERIAL PRIMARY KEY,
    //     // blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    //     // tags JSONB DEFAULT '[]'::jsonb
    //     // );`;
    //     // await client?.query(createBlogTagsTable);
    // const createBlogViewsTable=`CREATE TABLE blog_views (
    // id SERIAL PRIMARY KEY,
    // blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    // viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    // user_id TEXT REFERENCES users(id),
    // UNIQUE(blog_id,user_id)
// );`;
// await client?.query(createBlogViewsTable);

 // const createBlogLikesTable=`CREATE TABLE blog_likes (
 //    id SERIAL PRIMARY KEY,
 //    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
 //    user_id TEXT REFERENCES users(id),
 //    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 //    UNIQUE(blog_id, user_id) 
// );`;
// await client?.query(createBlogLikesTable);
// const createBlogCommentsTable=`
// CREATE TABLE blog_comments (
//     id SERIAL PRIMARY KEY,
//     blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
//     user_id TEXT REFERENCES users(id),
//     username VARCHAR(255),
//     content JSONB,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     parent_comment_id INTEGER REFERENCES blog_comments(id) ON DELETE CASCADE
// );`;
// await client?.query(createBlogCommentsTable);
    // const createAdminsTableQuery=`
    //     CREATE TABLE admins (
    //     id TEXT PRIMARY KEY,
    //     username VARCHAR(255) NOT NULL,
    //     email VARCHAR(255) UNIQUE NOT NULL
    //     )`;
    // await client?.query(createAdminsTableQuery);
// const createUserBookmarksTableQuery=`CREATE TABLE user_bookmarks(
//     id SERIAL PRIMARY KEY,
//     blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
//     user_id TEXT REFERENCES users(id),
//     UNIQUE(blog_id,user_id)
// )`;
// await client?.query(createUserBookmarksTableQuery);
// const createSearchBlogsFunction=`CREATE OR REPLACE FUNCTION search_blogs(
//     search_query TEXT,
//     page_number INTEGER,
//     page_size INTEGER
// ) RETURNS TABLE (
//     blog_id INTEGER,
//     user_id TEXT,
//     author VARCHAR(255),
//     title TEXT,
//     description TEXT,
//     tags JSONB,
//     total_views BIGINT,
//     total_likes BIGINT,
//     total_comments BIGINT,
//     recent_views BIGINT,
//     recent_likes BIGINT,
//     recent_comments BIGINT,
//     relevance_score FLOAT
// ) AS $$
// BEGIN
//     RETURN QUERY
//     WITH blog_metrics AS (
//         -- Calculate total and recent metrics for each blog
//         SELECT 
//             b.id,
//             b.user_id,
//             b.author,
//             b.title,
//             b.description,
//             b.tags,
//             -- Count total metrics
//             COUNT(DISTINCT v.id) as total_views,
//             COUNT(DISTINCT l.id) as total_likes,
//             COUNT(DISTINCT c.id) as total_comments,
//             -- Count recent metrics (last 7 days)
//             COUNT(DISTINCT CASE 
//                 WHEN v.viewed_at > NOW() - INTERVAL '7 days' 
//                 THEN v.id 
//             END) as recent_views,
//             COUNT(DISTINCT CASE 
//                 WHEN l.created_at > NOW() - INTERVAL '7 days' 
//                 THEN l.id 
//             END) as recent_likes,
//             COUNT(DISTINCT CASE 
//                 WHEN c.created_at > NOW() - INTERVAL '7 days' 
//                 THEN c.id 
//             END) as recent_comments
//         FROM blogs b
//         LEFT JOIN blog_views v ON b.id = v.blog_id
//         LEFT JOIN blog_likes l ON b.id = l.blog_id
//         LEFT JOIN blog_comments c ON b.id = c.blog_id
//         WHERE b.isReady = TRUE  -- Only search ready blogs
//         GROUP BY 
//             b.id, 
//             b.user_id, 
//             b.author, 
//             b.title, 
//             b.description, 
//             b.tags
//     )
//     SELECT 
//         bm.id as blog_id,
//         bm.user_id,
//         bm.author,
//         bm.title,
//         bm.description,
//         bm.tags,
//         bm.total_views,
//         bm.total_likes,
//         bm.total_comments,
//         bm.recent_views,
//         bm.recent_likes,
//         bm.recent_comments,
//         -- Calculate relevance score with weights
//         (
//             -- Text match relevance using to_tsvector (50% of total score)
//             CASE 
//                 WHEN search_query IS NOT NULL AND search_query <> '' THEN
//                     ts_rank(
//                         to_tsvector('english', 
//                             COALESCE(bm.title, '') || ' ' || 
//                             COALESCE(bm.description, '') || ' ' || 
//                             COALESCE(bm.author, '') ||
//                             -- Include tags in search
//                             COALESCE(array_to_string(
//                                 (SELECT array_agg(tag) 
//                                  FROM jsonb_array_elements_text(bm.tags) AS tag
//                                 ), ' ')
//                             , '')
//                         ),
//                         plainto_tsquery('english', search_query)
//                     ) * 50
//                 ELSE 0
//             END +
//             -- Recent activity weights (30% of total score)
//             (bm.recent_views * 0.15) +    -- Recent views: 15%
//             (bm.recent_likes * 0.10) +    -- Recent likes: 10%
//             (bm.recent_comments * 0.05) + -- Recent comments: 5%
//             -- Total activity weights (20% of total score)
//             (bm.total_views * 0.10) +     -- Total views: 10%
//             (bm.total_likes * 0.07) +     -- Total likes: 7%
//             (bm.total_comments * 0.03) +  -- Total comments: 3%
//             -- Bonus for tag matching
//             (CASE 
//                 WHEN search_query IS NOT NULL AND search_query <> '' THEN
//                     (SELECT COUNT(*) 
//                      FROM jsonb_array_elements_text(bm.tags) AS tag
//                      WHERE tag ILIKE '%' || search_query || '%'
//                     ) * 5
//                 ELSE 0
//             END)
//         ) as relevance_score
//     FROM blog_metrics bm
//     WHERE 
//         -- Search query filter
//         CASE 
//             WHEN search_query IS NOT NULL AND search_query <> '' THEN
//                 to_tsvector('english', 
//                     COALESCE(bm.title, '') || ' ' || 
//                     COALESCE(bm.description, '') || ' ' || 
//                     COALESCE(bm.author, '') ||
//                     -- Include tags in search
//                     COALESCE(array_to_string(
//                         (SELECT array_agg(tag) 
//                          FROM jsonb_array_elements_text(bm.tags) AS tag
//                         ), ' ')
//                     , '')
//                 ) @@ plainto_tsquery('english', search_query)
//             ELSE TRUE
//         END
//     ORDER BY relevance_score DESC
//     LIMIT page_size
//     OFFSET (page_number - 1) * page_size;
// END;
// $$ LANGUAGE plpgsql;`;
// await client?.query(createSearchBlogsFunction);
// const createSearchBlogsFunction2=`
// CREATE OR REPLACE FUNCTION discover_blogs(
//     page_number INTEGER DEFAULT 1,
//     page_size INTEGER DEFAULT 10,
//     discovery_mode TEXT DEFAULT 'mixed'  -- 'mixed', 'recent', 'featured'
// ) RETURNS TABLE (
//     id INTEGER,
//     title TEXT,
//     author VARCHAR(255),
//     description TEXT,
//     tags JSONB,
//     created_at VARCHAR(255),
//     total_likes BIGINT,
//     total_comments BIGINT,
//     total_count BIGINT
// ) AS $$
// BEGIN
//     RETURN QUERY
//     WITH blog_metrics AS (
//         -- Calculate metrics for each blog
//         SELECT 
//             b.id,
//             b.title,
//             b.author,
//             b.description,
//             b.tags,
//             b.created_at,
//             COUNT(DISTINCT l.id) as total_likes,
//             COUNT(DISTINCT c.id) as total_comments
//         FROM blogs b
//         LEFT JOIN blog_likes l ON b.id = l.blog_id
//         LEFT JOIN blog_comments c ON b.id = c.blog_id
//         GROUP BY 
//             b.id, 
//             b.title,
//             b.author,
//             b.description,
//             b.tags,
//             b.created_at
//     ),
//     total_blogs AS (
//         SELECT COUNT(*)::BIGINT as total_count 
//         FROM blogs
//     )
//     SELECT 
//         sb.id,
//         sb.title,
//         sb.author,
//         sb.description,
//         sb.tags,
//         sb.created_at,
//         sb.total_likes,
//         sb.total_comments,
//         tb.total_count
//     FROM blog_metrics sb
//     CROSS JOIN total_blogs tb
//     ORDER BY 
//         CASE 
//             WHEN discovery_mode = 'recent' THEN
//                 sb.created_at::timestamp with time zone
//             WHEN discovery_mode = 'featured' THEN
//                 (sb.total_likes + sb.total_comments)
//             ELSE
//                 -- Mixed mode: combine created_at and engagement
//                 sb.created_at::timestamp with time zone
//         END DESC
//     LIMIT CASE 
//         WHEN page_size <= 0 THEN NULL 
//         ELSE page_size 
//     END
//     OFFSET CASE 
//         WHEN page_number <= 0 THEN 0 
//         ELSE (page_number - 1) * page_size 
//     END;
// END;
// $$ LANGUAGE plpgsql;

// `;
//     await client?.query(createSearchBlogsFunction2);

// the 2 tables below are not created in the db!!!
// const createTablePostViews = `
// CREATE TABLE IF NOT EXISTS blog_views (
//   id SERIAL PRIMARY KEY,
//   post_id INTEGER REFERENCES posts(id),
//   session_id TEXT NOT NULL,
//   user_id INTEGER REFERENCES users(id), -- Add this column
//   ip_address TEXT,
//   user_agent TEXT,
//   viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );`;
// await client?.query(createTablePostViews);
// const createTableSession=`
// CREATE TABLE IF NOT EXISTS "session" (
//         "sid" VARCHAR NOT NULL COLLATE "default",
//         "sess" JSON NOT NULL,
//         "expire" TIMESTAMP(6) NOT NULL,
//         CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
//       );
//       `;
// await client?.query(createTableSession);
const alterTableUsers=`
ALTER TABLE users 
ADD COLUMN interests TEXT[] DEFAULT '{}';
;`;
await client?.query(alterTableUsers);
    }catch(err) {
        console.log(err);
    }
}
createTable();
