/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */

import Express from 'express';
import apn from 'apn';
import path from 'path';
import { json } from 'body-parser';

export const contentUpdateRouter = Express.Router();

const options = {
  token: {
    key: path.join(__dirname, '../../keys/AuthKey_D22K532YTB.p8'),
    keyId: process.env.KEY_ID,
    teamId: process.env.DEVELOPER_ID,
  },
  production: process.env.NODE_ENV !== 'development',
};

contentUpdateRouter.use(json);

contentUpdateRouter.post('/content-update', (request, response) => {
  response.send(request);
});
