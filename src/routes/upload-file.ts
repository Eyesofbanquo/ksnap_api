/* eslint-disable import/prefer-default-export */
import Express from 'express';
import { json } from 'body-parser';
import AWS from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';

config();

AWS.config.update({ region: 'us-east-1' });

const BUCKET_NAME = process.env.AWS_BUCKET || 'unknown';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET ?? '',
  },
});

const uploadFile = async (filename: string) => {
  const fileContent = fs.readFileSync(filename);
  const substringFilename = path.basename(filename);

  const params = {
    Bucket: BUCKET_NAME,
    Key: substringFilename,
    Body: fileContent,
    ACL: 'public-read',
  };

  const uploadingPromise = new Promise((t) => {
    s3.upload(params, (err, data) => {
      if (err) {
        throw err;
      }

      console.log(`File uploaded successfully. ${substringFilename} @ ${data.Location}`);

      return true;
    });
  });

  return uploadingPromise;
};

export const uploadFileRouter = Express.Router();

uploadFileRouter.use(json());
uploadFileRouter.post('/upload-from-file', async (request, response) => {
  const filename = request.body.file;
  await uploadFile(filename).then(() => {
    response.send('File uploaded');
  }).catch((error) => {
    response.send(error);
  });
});
