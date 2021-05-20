import Express from 'express';
import { json } from 'body-parser';

const PORT = process.env.PORT || 4000;

const app = Express();

app.use(json());

app.get('/', (request, response) => {
  response.send(
    'I missed you. Hopefully you had a wonderful nap. Talk to you soon. Love, Markim',
  );
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
