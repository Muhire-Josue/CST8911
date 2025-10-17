// validateToken.js
const jwt = require('jsonwebtoken');

// IMPORTANT: This secret must match the one used in your mock OAuth server
const SECRET_KEY = 'my-very-secret-key';

/**
 * Validates a JWT token from the Authorization header.
 * Returns the decoded token if valid, or null if invalid.
 */
module.exports = function validateToken(req, res) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return null;
  }
};
