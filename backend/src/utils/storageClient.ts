import path from 'path';
require("dotenv").config({path: path.resolve(__dirname, '../../.env')});
import {S3} from '@aws-sdk/client-s3'; 
import {NodeHttpHandler} from '@aws-sdk/node-http-handler';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

const s3 = new S3({
    region: process.env.REGION,
    endpoint: process.env.ENDPOINT!,
    credentials: {
         accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_KEY!,
    },
    forcePathStyle: true,
    requestHandler: new NodeHttpHandler({
    httpAgent: agent,
    httpsAgent: agent
  })
});

// const validateS3 = async () => {
//   try {
//     const result = await s3.listBuckets({});
//     console.log('Buckets:', result.Buckets);
//   } catch (err) {
//     console.error('Error listing buckets:', err);
//   }
// }
// validateS3();

export default s3;

