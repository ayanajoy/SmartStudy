const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User'); // ✅ FIXED: import User model

// ✅ GET /me → Get logged-in user info
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "User not found" });
  }
});

// Auth routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
