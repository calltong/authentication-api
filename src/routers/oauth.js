import express from 'express';
import { di } from '../di';
import jwt from 'jwt-simple';
import { config } from '../config';

export const router = express.Router();
router.post('/register', register);
router.post('/token', login);

export async function login(req, res) {
  try {
    let auth = req.headers['authorization'];
    if (auth === undefined) {
      res.status(400).json({ message: 'authorization is required' });
      return;
    }

    let typ = auth.substr(0, 6);
    if (typ !== 'Basic ') {
      res.status(400).json({ message: 'basic authorization is required' });
      return;
    }
    let code = auth.replace('Basic ', '');
    let db = di.get('db');
    let doc = await db.collection('users').findOne({ code: code });
    if (doc) {
      doc.code = undefined;
      let date = new Date();
      date.setDate(date.getDate() + 1);
      let payload = {
        id: doc._id,
        name: doc.name,
        email: doc.email,
        role: 'customer',
        expires: date.getTime(),
      };
      let token = jwt.encode(payload, config.jwt.secret);
      res.json({ access_token: token });
    } else res.status(404).json({ message: 'username or password incorrectly' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function register(req, res) {
  try {
    let name = req.body.name || '';
    let email = req.body.email || '';
    let username = req.body.username || '';
    let password = req.body.password || '';
    if (email === '') res.status(400).json({ message: 'email is required' });
    else if (email === '') res.status(400).json({ message: 'email is required' });
    else if (username === '') res.status(400).json({ message: 'username is required' });
    else if (password === '') res.status(400).json({ message: 'password is required' });
    else {
      let code = Buffer(`${username}:${password}`).toString('base64');
      let user = {
        name,
        email,
        username,
        code,
      };
      let db = di.get('db');
      let doc = await db.collection('users').findOne({ username: username });
      if (doc) res.json({ message: 'username already register' });
      else {
        doc = await db.collection('users').insertOne(user);
        if (doc.insertedCount === 1) res.json({ result: doc.insertedId });
        else res.status(500).json({ message: 'Cannot create user document' });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
