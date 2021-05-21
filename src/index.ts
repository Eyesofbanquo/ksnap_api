import Express from 'express';
import { json } from 'body-parser';
import AWS from 'aws-sdk';
import fs from 'fs';
import multer from 'multer';
import multers3 from 'multer-s3';
import path from 'path';

import { config } from 'dotenv';

AWS.config.update({ region: 'us-east-1' });

config();

const PORT = process.env.PORT || 4000;
const BUCKET_NAME = process.env.AWS_BUCKET || 'unknown';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET ?? '',
  },
});
const uploadFile = async (filename: string) => {
  const fileContent = fs.readFileSync(filename);

  const params = {
    Bucket: BUCKET_NAME,
    Key: 'k1.jpg',
    Body: fileContent,
    ACL: 'public-read',
  };

  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }

    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

const app = Express();

app.use(json());

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.post('/', async (request, response) => {
  const filename = request.body.file;

  await uploadFile(filename);

  response.send('File uploaded');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
