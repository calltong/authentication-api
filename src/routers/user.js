import express from 'express';
import { ObjectID } from 'mongodb';
import { di } from '../di';

export const router = express.Router();
router.post('/unregister', unregister);

export async function unregister(req, res) {
  try {
    let db = di.get('db');
    let doc = await db.collection('users').deleteOne({ _id: ObjectID(req.user.id) });
    if (doc.deletedCount === 1) res.json({ message: 'success' });
    else res.status(500).json({ message: 'Cannot delete user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
