import express from 'express';
import { read, write, hasSameProps } from '../utils/functions.js';
import { userObj, usersPath } from '../utils/consts.js';
import { isNotLogged } from '../utils/middleware.js';

export const userRouter = express();

userRouter.post('/register', isNotLogged, async (req, res) => {
  try {
    const users = await read(usersPath);
    const body = req.body;
    if (hasSameProps(userObj, body)) {
      users.push(req.body);
      await write(usersPath, users);
      return res.json({ message: 'User registered successfully' });
    }
    return res.status(409).send('The body provided does not correspond');
  } catch (error) {
    console.error('An error occurred: ' + error.message);
  }
});
