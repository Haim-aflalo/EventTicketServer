import { read } from '../utils/functions.js';
import { usersPath } from '../utils/consts.js';

export async function isNotLogged(req, res, next) {
  const body = req.body;
  const users = await read(usersPath);
  const user = users.find((u) => u.username === body.username);
  if (user) {
    return res.status(409).send('already logged');
  }
  next();
}

export async function userLogged(req, res, next) {
  const body = req.body;
  const users = await read(usersPath);
  const user = users.find(
    (u) => u.username === body.username && u.password === body.password
  );
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  next();
}
