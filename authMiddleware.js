const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ error: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied, admin only' });
  }
};

module.exports = { verifyToken, verifyAdmin };
