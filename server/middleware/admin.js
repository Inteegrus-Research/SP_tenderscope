import { auth } from './auth.js';

export const admin = [
  auth,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  }
];