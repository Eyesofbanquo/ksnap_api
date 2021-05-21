/* eslint-disable import/prefer-default-export */
import Express from 'express';
import { json } from 'body-parser';
import AWS from 'aws-sdk';
import multer from 'multer';
import multers3 from 'multer-s3';
import { config } from 'dotenv';
import path from 'path';

config();

AWS.config.update({ region: 'us-east-1' });

const BUCKET_NAME = process.env.AWS_BUCKET || 'unknown';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET ?? '',
  },
});

const upload = multer({
  storage: multers3({
    s3,
    bucket: BUCKET_NAME,
    key: (request, file, cb) => {
      cb(null, file.originalname);
    },
    acl: 'public-read',
  }),
});

export const uploadRouter = Express.Router();

uploadRouter.use(Express.static(path.join(__dirname, 'public')));
uploadRouter.use(Express.static(path.join(__dirname, './styles')));

uploadRouter.get('/upload', (request, response) => {
  const p = path.join(__dirname, '../pages/upload.html');
  console.log(p);
  response.sendFile(path.join(__dirname, '../pages/upload.html'));
});

uploadRouter.post('/upload', upload.single('file'), async (request, response) => {
  response.send('File uploaded');
});
