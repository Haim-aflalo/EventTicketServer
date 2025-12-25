import express from 'express';
import { read, write, hasSameProps } from '../utils/functions.js';
import {
  userObj,
  ticketsObj,
  usersPath,
  receipsPath,
  eventsPath,
} from '../utils/consts.js';
import { isNotLogged, userLogged } from '../utils/middleware.js';

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

userRouter.post('/tickets/buy', userLogged, async (req, res) => {
  try {
    const body = req.body;
    if (hasSameProps(ticketsObj, body)) {
      const events = await read(eventsPath);
      const receips = await read(receipsPath);
      const event = events.findIndex((e) => e.eventName === body.eventName);
      console.log(event);
      if (event !== -1) {
        if (body.quantity <= events[event].ticketsForSale) {
          events[event].ticketsForSale -= body.quantity;
          receips.push({
            username: body.username,
            eventName: body.eventName,
            ticketsBought: body.quantity,
          });
          await write(eventsPath, events);
          await write(receipsPath, receips);
          return res.json({ message: 'Tickets purchased successfully' });
        }
        return res
          .status(409)
          .send('Not enough tickets available for this event');
      }
      return res.status(404).send('Event Not Found');
    }
    return res.status(409).send('The body provided does not correspond');
  } catch (error) {
    console.error('An error occurred: ' + error.message);
  }
});

userRouter.get('/:username/summary', async (req, res) => {
  try {
    const result = { totalTicketsBought: 0, events: [] };
    const data = await read(receipsPath);
    const userReceips = data.filter((r) => r.username === req.params.username);
    for (let receips of userReceips) {
      result.totalTicketsBought += receips.ticketsBought;
      result.events.push(receips.eventName);
    }
    result.averageTicketsPerEvent =
      result.totalTicketsBought / result.events.length;
    res.send(result);
  } catch (error) {
    console.error('An error occurred: ' + error.message);
  }
});
