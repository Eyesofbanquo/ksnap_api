/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Express from 'express';
import { json } from 'body-parser';
import AWS from 'aws-sdk';
import sslRedirect from 'heroku-ssl-redirect';

import WebSocket, { Server } from 'ws';

import path from 'path';

import axios from 'axios';

import https from 'https';
import fs from 'fs';
import cors from 'cors';

import { config } from 'dotenv';
import cron from 'node-cron';
import { uploadFileRouter as UploadFileRouter } from './routes/upload-file';
import { uploadRouter as UploadRouter } from './routes/upload';
import { retrieveRouter as RetrieveRouter } from './routes/retrieve';
import { contentUpdateRouter as ContentUpdateRouter } from './routes/content-update';

AWS.config.update({ region: 'us-east-1' });

config();

const PORT = process.env.PORT || 4000;

const app = Express();

app.use(sslRedirect());
app.use(cors());
app.use(json());
app.use(UploadFileRouter);
app.use(UploadRouter);
app.use(RetrieveRouter);
app.use(ContentUpdateRouter);

// For Enabling static files. First point to public then add other possible directories
app.use(Express.static(path.join(__dirname, 'public')));
app.use(Express.static(path.join(__dirname, './styles')));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/health', (request, response) => {
  response.send('ok');
});

if (process.env.NODE_ENV === 'production') {
  https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../.certs/private.key')),
    cert: fs.readFileSync(path.join(__dirname, '../.certs/kyrinnukkah_com.pem')),
  }, app)
    .listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
} else {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

cron.schedule('45 7 * * *', async () => {
  const weatherInfo = await axios.get('https://www.wttr.in/Toronto', {
    params: { format: 'j1' },
  });

  const currentWeather = weatherInfo.data.current_condition[0].FeelsLikeC;

  const body = `
Here is your weather report:
Currently, it feels like ${currentWeather}C outside.`;

  await axios.post('https://kyrinnukkah.herokuapp.com/weather', {
    title: 'Good Morning ??????',
    quote: body,
    content: 'https://www.wttr.in/Toronto.png?m',
  });
}, {
  scheduled: true,
  timezone: 'America/New_York',
});
