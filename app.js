import express from 'express';
import { userRouter } from './routes/users.js';
import { eventRouter } from './routes/events.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/users', userRouter);
app.use('/creator', eventRouter);

app.listen(port, function (err) {
  if (err) console.log(err);
  console.log(`Server listening on PORT ${port}`);
});
