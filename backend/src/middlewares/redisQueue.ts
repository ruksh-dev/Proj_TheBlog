import Queue from 'bull';
import path from 'path';
import * as dotenv from 'dotenv'
dotenv.config({path: path.resolve(__dirname,'../../.env')});
const REDIS_URL=process.env.REDIS_URL || "";
 const notificationQueue=new Queue('blog-notification',REDIS_URL,{
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
 });

 notificationQueue.on('error',(err)=>{
    console.log('bull queue error:',err);
 });
 export const cleanQueue = async () => {
    try {
        await notificationQueue.empty();
        console.log('Queue cleaned successfully');
    } catch (error) {
        console.error('Error cleaning queue:', error);
    }
};

 export default notificationQueue;