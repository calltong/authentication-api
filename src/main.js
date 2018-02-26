import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';

import { di } from './di';
import { config } from './config';
import { mongodb } from './mongodb';

import { router as user } from './routers/user';
import { router as oauth } from './routers/oauth';

const start = async () => {
  try {
    let db = await mongodb.connect();
    di.set('db', db);

    const app = express();

    app.use(cors(config.cors));
    app.use(bodyParser.json({ limit: '250mb' }));
    app.use(jwt({ secret: config.jwt.secret }).unless({
      path: [
        new RegExp('/api/check'),
        new RegExp('/api/v1/oauth/.+'),
      ],
    }));
    
    /// check token expires ///
    app.use(async (req, res, next) => {
      let date = new Date();
      if (req.user && date.getTime() > req.user.expires) {
        res.status(401).json({message: 'Your token was expired'});
      }
      next();
    });
    app.get('/api/check', (req, res) => {
      res.json({ message: 'api ok' });
    });

    app.use('/api/v1/user', user);
    app.use('/api/v1/oauth', oauth);

    app.use(([body, status], req, res, next) => {
      res.status(status).json(body);
      next();
    });

    app.listen(3002);
  } catch (err) {
    console.error(err);
  }
};

start();
