import getClient from '../utils/db';
import {clients} from '../clients';
 interface clientT{
    id: string;
    postId: string;
    res: any;
}
function insertClientIntoGroup(newClient: clientT) {
    clients.push(newClient);
}
export default async function commentEventHandler(req:any,res:any,next:any) {
    try{
        const postId=req.params.id;
        const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
        const getPostCommentsQuery=`SELECT 
    id,
    user_id,
    username,
    content,
    created_at,
    CASE
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 60 THEN 
            EXTRACT(EPOCH FROM NOW() - created_at)::INT || 's ago'
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 3600 THEN 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 60)::INT || 'min ago'
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 86400 THEN 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 3600)::INT || 'h ago'
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 2592000 THEN 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 86400)::INT || 'd ago'
        WHEN EXTRACT(EPOCH FROM NOW() - created_at) < 31536000 THEN 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 2592000)::INT || 'months ago'
        ELSE 
            (EXTRACT(EPOCH FROM NOW() - created_at) / 31536000)::INT || 'years ago'
    END AS formatted_created_at
FROM 
    blog_comments WHERE blog_id=$1 AND parent_comment_id IS NULL;`;
        const pgclient=await getClient();
        const queryResponse=await pgclient?.query(getPostCommentsQuery,[postId]);
        const data=`data: ${JSON.stringify(queryResponse!.rows)}\n\n`;
        res.write(data);
        const clientId=`${postId}_${Date.now()}`;
        const newClient={
            id: clientId,
            postId,
            res
        };
        insertClientIntoGroup(newClient);
        req.on('close', () => {
            console.log(`${clientId} Connection closed`);
            const index = clients.findIndex((client: clientT) => client.id === clientId);
            if (index !== -1) { 
                clients.splice(index, 1);              
            }
        });
    }catch(err){
        next(err);
    }
}
