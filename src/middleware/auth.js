/**
 * @file middleware/auth.js
 * @description JWT authentication middleware. Extracts the Bearer token from the
 * Authorization header, verifies it against JWT_SECRET, and attaches the decoded
 * user payload to req.user before passing control to the next handler.
 */
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token)
    return res.status(401).json({ error: 'Access Denied, no token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;

    next();
  });
}

module.exports = authenticateToken;