const express = require('express');
const router = express.Router();
const { register, login } = require('./authController');

router.post('/register', register);

router.post('/login', login);
const { verifyAdmin } = require('./authMiddleware');

router.get('/admin-data', verifyAdmin, (req, res) => {
  res.json({ message: 'This is admin-only data' });
});

module.exports = router;
