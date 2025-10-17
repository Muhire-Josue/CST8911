const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// secret key for signing JWTs (use the same in your Azure Function)
const SECRET_KEY = 'my-very-secret-key';

// login route – issues a token
app.post('/login', (req, res) => {
  const { username } = req.body;

  // normally you’d validate credentials here
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  // generate JWT token (expires in 1 hour)
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
});

// verify route – optional, for testing token validity
app.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ valid: true, decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`OAuth mock server running on port ${PORT}`));
