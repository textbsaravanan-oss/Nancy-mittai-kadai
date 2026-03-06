const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUsers, deleteUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.route('/').get(protect, admin, getUsers);
router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
