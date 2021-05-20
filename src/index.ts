import Express from 'express';
import { json } from 'body-parser';

const PORT = process.env.PORT || 4000;

const app = Express();

app.use(json());

app.get('/', (request, response) => {
  response.send('This works');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
