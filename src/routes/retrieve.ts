import Express from 'express';
import client from '../db';

export const retrieveRouter = Express.Router();

retrieveRouter.get('/retrieve', async (request, response) => {
  const results = await client.query('select * from dates');

  response.send({
    data: results.rows,
    status: 200,
  });
});
