import { max } from "moment-timezone";
import notificationQueue from "./redisQueue";

const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));
const addBlogNotificationJob=async (blogId:number,maxAttempts=3)=>{
    try{
        console.log("blogID",blogId);

        const response=await notificationQueue.add({blogId});
        console.log("JOB ADDED SUCCESSFULLY!, RESPONSE: ",response);
        maxAttempts=3;
        return;
    }catch(err){
        console.log(err);
        maxAttempts--;
        if(maxAttempts==0) return;
        await delay(2000);
        await addBlogNotificationJob(blogId,maxAttempts);
    }
}
export default addBlogNotificationJob;