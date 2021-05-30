/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */

import Express from 'express';
import apn from 'apn';
import path from 'path';
import { json } from 'body-parser';
import client from '../db';
import { PullContentUpdateMiddleware, a, NetworkRequestContentUpdateMiddleware } from '../middleware';

export const contentUpdateRouter = Express.Router();

const options = {
  token: {
    key: path.join(__dirname, '../../keys/AuthKey_D22K532YTB.p8'),
    keyId: process.env.KEY_ID,
    teamId: process.env.DEVELOPER_ID,
  },
  production: process.env.NODE_ENV === 'production',
};
const apnProvider = new apn.Provider(options);

contentUpdateRouter.use(json());

contentUpdateRouter.post('/content-update', PullContentUpdateMiddleware, NetworkRequestContentUpdateMiddleware, async (request, response) => {
  const { image, quote } = request.body;

  const devices = await client.query('SELECT token FROM device_tokens');

  const tokens = devices.rows.map((value) => value.token);

  const note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.alert = {
    title: 'New Content!',
    body: '',
  };
  note.payload = { messageFrom: 'kyrrinn' };
  note.topic = process.env.BUNDLE_ID;
  note.badge = 0;
  note.mutableContent = true;
  note.payload = {
    content: image,
    quote,
  };

  console.log(note);
  const result = await apnProvider.send(note, tokens);

  response.send(result.sent);
});
