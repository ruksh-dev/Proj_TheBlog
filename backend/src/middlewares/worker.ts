import notificationQueue from "./redisQueue";
import getClient from '../utils/db';
import nodemailer from 'nodemailer';
// import { cleanQueue } from "./redisQueue";
// cleanQueue();

const matchedUsersQuery=`
SELECT id,email 
FROM users WHERE interests && $1;`;

const getBlogDataQuery=`
SELECT tags FROM blogs WHERE id=$1;
`;

const combinedQuery=`
WITH tags_array AS (
  SELECT array(SELECT jsonb_array_elements_text(tags)) AS tags_array
  FROM blogs
  WHERE id = $1
)
SELECT id, email
FROM users, tags_array
WHERE interests && tags_array.tags_array;
`;

const sendNewBlogNotification=async({
    useremail,
    blogId
}:{
    useremail:string,
    blogId:number
})=>{
    console.log("email:",useremail,"blogId:",blogId);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'YOUR_GMAIL',
          pass: 'YOUR_PASSWD'
        }
      });
const Link=`http://localhost:5173/posts/${blogId}`;
const mailOptions = {
    from: 'recipent_mail',
    to: useremail,
    subject: '',
    text: `Check out this new blog that we recommend you:`,
    html: `<p>${Link}</p>`
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("error:", error);
        reject(error);
      } else {
        console.log('Email Sent Successfully to:', useremail);
        resolve(info);
      }
    });
  });
}

console.log('Worker process started...');

notificationQueue.process(async(job)=>{
    console.log("STARTING PROCESSING JOB...");
    try{
        console.log("JOBB: ",JSON.stringify(job));
        const blogId=job.data.blogId as number;
        console.log("BLOG ID:",blogId);
        const client=await getClient();
        const matchedUsersResponse=await client?.query(combinedQuery,[blogId]);
        console.log("MATCHED_USERS:",JSON.stringify(matchedUsersResponse));
        if (!(matchedUsersResponse && matchedUsersResponse.rows.length>0)) return {success: false};
        await Promise.all(matchedUsersResponse?.rows.map(async (row) => {
            try {
                console.log("sending email notifcation to: ",row.email,".....");
                const response = await sendNewBlogNotification({
                    useremail: row.email,
                    blogId
                });
                console.log('Email Sent Response:', response);
            } catch (err) {
                console.error("Error sending notification to:", row.email, err);
            }
        }));
        await client?.end();
        return {success: true};
    }catch(err){
        console.log(err);
        throw err;
    }
});

notificationQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed! Result:`, result);
  });
  
notificationQueue.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed! Error:`, error);
  });
  
notificationQueue.on('stalled', (job) => {
    console.warn(`Job ${job.id} stalled!`);
  });

  
  notificationQueue.on('error', (error) => {
    console.error('Queue error:', error);
  });
  async function checkQueueHealth() {
    const jobCounts = await notificationQueue.getJobCounts();
    console.log('Job counts:', jobCounts);
    
    const waitingJobs = await notificationQueue.getWaiting();
    console.log('Waiting jobs:', waitingJobs.length);
    
    const activeJobs = await notificationQueue.getActive();
    console.log('Active jobs:', activeJobs.length);
    
    const failedJobs = await notificationQueue.getFailed();
    console.log('Failed jobs:', failedJobs.length);
  }
