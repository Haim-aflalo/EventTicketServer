import express from 'express';
import { read, write, hasSameProps } from '../utils/functions.js';
import { userLogged } from '../utils/middleware.js';
import { eventsPath, eventsObj } from '../utils/consts.js';
export const eventRouter = express();

eventRouter.post('/events', userLogged, async (req, res) => {
  try {
    const events = await read(eventsPath);
    const body = req.body;
    if (hasSameProps(eventsObj, body)) {
      events.push(req.body);
      await write(eventsPath, events);
      return res.json({ message: 'Event created successfully' });
    }
    return res.status(401).send('The body provided does not correspond');
  } catch (error) {
    console.error('An error occurred: ' + error.message);
  }
});
