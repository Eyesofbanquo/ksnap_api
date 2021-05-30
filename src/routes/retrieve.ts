/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import Express from 'express';
import path from 'path';
import apn from 'apn';
import client from '../db';

export const retrieveRouter = Express.Router();

const options = {
  token: {
    key: path.join(__dirname, '../../keys/AuthKey_D22K532YTB.p8'),
    keyId: process.env.KEY_ID,
    teamId: process.env.DEVELOPER_ID,
  },
  production: process.env.NODE_ENV !== 'development',
};

const apnProvider = new apn.Provider(options);
const deviceToken = '005eb5507dc8f10758c0f523b1d561a840b67689eeece023c7be142087f83c99';

retrieveRouter.get('/retrieve', async (request, response) => {
  const results = await client.query('select * from dates');

  response.send({
    data: results.rows,
    status: 200,
  });
});

retrieveRouter.post('/register', async (request, response) => {
  const { token } = request.body;

  console.log(request.body);

  const results = await client.query('INSERT INTO device_tokens (token) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *', [token]);

  console.log(results);
  response.send({
    data: {
      success: true,
    },
  });
});

retrieveRouter.post('/apn', async (request, response) => {
  const { alert, body } = request.body;

  const devices = await client.query('SELECT token FROM device_tokens');

  const tokens = devices.rows.map((value) => value.token);
  console.log(tokens);

  const note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.alert = {
    title: alert,
    body: body ?? '',
  };
  note.payload = { messageFrom: 'kyrrinn' };
  note.topic = process.env.BUNDLE_ID;

  const result = await apnProvider.send(note, tokens);

  response.send(result.sent);
});

retrieveRouter.post('/weather', async (request, response) => {
  const { title, content, quote } = request.body;

  const devices = await client.query('SELECT token FROM device_tokens').catch();

  const tokens = devices.rows.map((value) => value.token);

  const note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.alert = {
    title,
    body: '',
  };
  note.badge = 0;
  note.mutableContent = true;
  note.payload = { content, quote };
  note.topic = process.env.BUNDLE_ID;

  const result = await apnProvider.send(note, tokens);

  console.log(result);

  response.send(result.sent);
});
