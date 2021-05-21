/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Express from 'express';
import { json } from 'body-parser';
import AWS from 'aws-sdk';

import path from 'path';

import { config } from 'dotenv';
import { uploadFileRouter as UploadFileRouter } from './routes/upload-file';
import { uploadRouter as UploadRouter } from './routes/upload';

AWS.config.update({ region: 'us-east-1' });

config();

const PORT = process.env.PORT || 4000;

const app = Express();

app.use(json());
app.use(UploadFileRouter);
app.use(UploadRouter);

// For Enabling static files. First point to public then add other possible directories
app.use(Express.static(path.join(__dirname, 'public')));
app.use(Express.static(path.join(__dirname, './styles')));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/health', (request, response) => {
  response.send('ok');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
